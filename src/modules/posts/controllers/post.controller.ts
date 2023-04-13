import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Redirect, UsePipes, ValidationPipe } from '@nestjs/common';
import createPostDto from '../dto/create-post.dto';
import { PostService } from '../service/post.service';
import { IAuthTokenContent } from 'src/interfaces';
import { User } from 'src/decorators';
import { PostEntity } from '../entities/post.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Controller('post')
export class PostController {

    constructor(private readonly postService : PostService) {}

    @Get()
    getAllPosts() {
        return this.postService.getAllPosts()
    }

    
    @Get('friends')
    getAllPostsFromFriends(
        @User() user : UserEntity
    ) {
        return this.postService.getAllPostsFromFriends(user)
    }



    @Get('friendsOfFriends')
    getPostsFromFriendsOfFriends(
        @User() user : UserEntity
    ) {
        return this.postService.getPostsFromFriendsOfFriends(user)
    }

    @Get(':id')
    getUserById(
        @Param('id') id: number
    ){
        return this.postService.getPostById(id)
    }

    @Post('create')
    public async createPost(
        @Body() payload:createPostDto,
        @User() {id}:IAuthTokenContent
    ):Promise<PostEntity>{
        return await this.postService.createPost(payload,id)
    }

    @Put(':id')
    updateUser(
        @Body() updatePostDto : createPostDto,
        @Param('id') id
    ) {
        return this.postService.updatePost(id, updatePostDto)
    }

    @Delete(':id')
    removeUser(
        @Param('id') id : string
    ) {
        return this.postService.removePost(id)
    }
}
