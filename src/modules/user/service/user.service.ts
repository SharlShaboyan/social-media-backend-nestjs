import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AppDataSource } from "src/data-source";
import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { IUserLogin, IUserRegister } from "../interfaces";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepo: Repository<UserEntity>
    ) { }

    async getAllUsers() {
        return await this.usersRepo.find()
    }

    async getUserById(id: number) {
        const user = await this.usersRepo.findOne({
            where: { id }
        })

        if (!user) {
            throw new NotFoundException(`Համակարգի չի կարող գտնել այդպիսի օգտվող`);
        }

        return user
    }

    async findOne(name: string, password: string) {
        const user = await this.usersRepo.find({
            where: {
                name,
                password
            }
        })

        if (!user) {
            throw new NotFoundException(`Համակարգի չի կարող գտնել այդպիսի օգտվող`);
        }

        return user
    }

    async createUser(body: IUserRegister) {
        const newuser = await this.usersRepo.save(this.usersRepo.create({
            ...body,
            role: 'user'
        }))
            .catch(e => {
                console.log(e)
                if (e.detail.includes('email')) {
                    throw new BadRequestException('Այդ մեյլով օգտատեր արդեն գրանցված է');
                }
            })

            if(!newuser) {
                throw new BadRequestException("Registration failed")
            }

        delete newuser['password']

        return newuser
    }

    public async loginUser({ email, password }: IUserLogin): Promise<UserEntity> {
        const user = await this.usersRepo.findOne({
            where: {
                email,
                password
            }
        }).catch(e => {
            console.log(e)
        })
        if (!user) {
            throw new NotAcceptableException('Համակարգը չի կարող գտնել այդպիսի օգտվող');
        }

        delete user.password
        return user
    }


    async updateUser(id: any, body: any) {
        const user = await this.usersRepo.createQueryBuilder()
            .update(body)
            .where({ id })
            .returning('*')
            .execute()
        return user.raw[0]
    }

    async removeUser(id: any) {
        await this.usersRepo.delete({ id })
        return "Deleted the" + id + "th user"
    }

    async sendFriendRequest(
        authUser: UserEntity,
        useriD: number
    ) {
        try {
            const reqUser: any = await this.usersRepo.findOne({
                where: { id: useriD },
                relations: ['requests', 'friends']
            })

            const user: any = await this.usersRepo.findOne({
                where: { id: authUser.id },
                relations: ['requests', 'friends']
            })

            const friendExist = user.friends.filter(e => e.id == useriD);
            const requestExist = reqUser.requests.filter(e => e.id == authUser.id);

            if(friendExist.length > 0) {
                return "Friend exist"
            } else if(requestExist.length > 0) {
                return "Request sent"
            } else {
                delete reqUser.password
                reqUser.requests = [
                    ...reqUser.requests,
                    authUser
                ]

                return await this.usersRepo.save(reqUser)
            } 
        } catch(e) {
            console.log(e)
        }
    }

    async getFriendRequestt(
        authUser: UserEntity
    ) {
        try{
            const myRequests: UserEntity = await this.usersRepo.findOne({
                where: {
                    id: authUser.id
                },
                relations: ['requests']
            })

            return myRequests
        } catch(e) {
            console.log(e)
        } 
    }

    async acceptFriendRequest(
        authUser: UserEntity,
        useriD: number
    ) {
        try {
            const transaction = await AppDataSource.manager.transaction(
                "SERIALIZABLE",
                async (transactionalEntityManager): Promise<string> => {

                    await transactionalEntityManager
                        .createQueryBuilder()
                        .relation(UserEntity, "friends")
                        .of({ id: authUser.id })
                        .add({ id: useriD })

                    await transactionalEntityManager
                        .createQueryBuilder()
                        .relation(UserEntity, "requests")
                        .of(authUser)
                        .remove({ id: useriD })

                    return "Fried added"
                }
            )

            return transaction
        } catch (e) {
            console.log(e)
            throw new NotAcceptableException('Ընդունման ժամանակ տեղի է ունեցել սխալ');
        }
    }

    async getFriends(
        authUser: UserEntity
    ) {
        try {
            const friends = await this.usersRepo.query(`
                SELECT id, name, email, role 
                FROM "user" AS u
                INNER JOIN "user_friends_user" AS f
                ON f."userId_2" = u.id
                WHERE f."userId_1"= '${authUser.id}'
                UNION
                SELECT id, name, email, role 
                FROM "user" AS u
                INNER JOIN "user_friends_user" AS f
                ON f."userId_1" = u.id
                WHERE f."userId_2"= '${authUser.id}'
            `);

            return friends
        } catch (e) {
            console.log(e)
        }
    }

}