import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from 'src/decorators';
import createUserDto from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService) {}
   
    
    @Get()
    getAllUsers() {
        return this.userService.getAllUsers()
    }

    @Get(':id')
    getUserById(
        @Param('id') id
    ):Promise<UserEntity>{
        return this.userService.getUserById(id)
    }

    @Put(':id')
    updateUser(
        @Body() updateUserDto : createUserDto,
        @Param('id') id
    ) {
        return this.userService.updateUser(id, updateUserDto)
    }

    @Delete(':id')
    removeUser(
        @Param('id') id : string
    ) {
        return this.userService.removeUser(id)
    }

    @Post(':id')
    sendFriendRequest(
        @User() user : UserEntity,
        @Param('id') id : number
    ) {
        return this.userService.sendFriendRequest(user, id)
    }

    @Get('friend/requests')
    getFriendRequest(
        @User() user : UserEntity
    ) {
        return this.userService.getFriendRequestt(user)
    }

    @Post('friend/requests/accept/:id')
    acceptFriendRequest(
        @User() user : UserEntity,
        @Param('id') id : number
    ) {
        return this.userService.acceptFriendRequest(user, id)
    }

    @Get('friends/all')
    getFriends(
        @User() user : UserEntity
    ) {
        return this.userService.getFriends(user)
    }
}
