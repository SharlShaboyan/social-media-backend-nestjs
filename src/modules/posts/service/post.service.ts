import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { where } from "sequelize/types";
import { AppDataSource } from "src/data-source";
import { User } from "src/decorators";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { In, Repository } from "typeorm";
import { PostEntity } from "../entities/post.entity";
import { IPostPayload } from "../interfaces/index";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity) 
        private postsRepo : Repository<PostEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>
        ) {}

    async getAllPosts() {
        return await this.postsRepo.find({
            relations : {
                owner : true
            }
        })
    }
        
    async getAllPostsFromFriends(
        user: UserEntity
    ): Promise<any> {
        try {
            const postsF = await AppDataSource.manager.query(`
                SELECT p.id AS postid, p.description, p.created, p."ownerId" FROM "post" AS p
                INNER JOIN "user_friends_user" AS f
                ON f."userId_1" = p."ownerId"
                WHERE f."userId_2"= '${user.id}'

                UNION

                SELECT p.id AS postid, p.description, p.created, p."ownerId"  FROM "post" AS p
                INNER JOIN "user_friends_user" AS f
                ON f."userId_2" = p."ownerId"
                WHERE f."userId_1"= '${user.id}'
            `);

            return postsF
        } catch(e) {
            throw new NotFoundException(`There aren't any posts form your friends`);
        }
       
    }

    async getPostsFromFriendsOfFriends(
        user : UserEntity
    ): Promise<any> {
        try {
            const postsFF = await AppDataSource.manager.query(`
                SELECT p.id AS postID, p.description, p.created, p."ownerId", f."userId_1" AS mutualfriend FROM "post" AS p
                INNER JOIN "user_friends_user" AS f ON f."userId_2" = p."ownerId"
                INNER JOIN "user_friends_user" AS f2 ON f2."userId_2" = f."userId_1"
                WHERE f."userId_1" <> '${user.id}' AND f."userId_2" <> '${user.id}'
                AND f2."userId_1" = '${user.id}'

                UNION

                SELECT p.id AS postID, p.description, p.created, p."ownerId", f."userId_2" AS mutualfriend FROM "post" AS p
                INNER JOIN "user_friends_user" AS f ON f."userId_1" = p."ownerId"
                INNER JOIN "user_friends_user" AS f2 ON f2."userId_1" = f."userId_2"
                WHERE f."userId_2" <> '${user.id}' AND f."userId_1" <> '${user.id}'
                AND f2."userId_2" = '${user.id}'
            `);

            if(postsFF.length == 0) {
                throw new NotFoundException(`There aren't any posts form your friends of friends`);
            } else {
                return postsFF
            }  
        } catch(e) {
            throw new NotFoundException(`Problem with posts`);
        }
        
    }

    async getPostById(id : any) {
        const post = await this.postsRepo.find({
            where: { id }
        })

        if(!post) {
            throw new NotFoundException(`Համակարգի չի կարող գտնել այդպիսի հրապարակում`);
        }

        return post
    }

    public async createPost({description}:IPostPayload , id:any):Promise<any>{
        const post = new PostEntity()
        post.description = description
        post.owner = await this.userRepo.findOne({ where : { id } })
        delete post.owner.password
        await this.postsRepo.save(post)
        const posts = await this.postsRepo.find({
            relations : {
                owner: true
            }
        })
        return posts
    }

    async updatePost(id : any, body : any) {
        const post = await this.postsRepo.createQueryBuilder()
        .update(body)
        .where({ id })
        .returning('*')
        .execute()
        return post.raw[0]
    }

    async removePost(id : any) {
        await this.postsRepo.delete({id})
        return "Deleted the" + id+"th post"
    }

}