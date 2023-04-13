import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthToken } from 'src/interfaces';
import createUserDto from 'src/modules/user/dto/create-user.dto';
import { UserService } from 'src/modules/user/service/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { UserEntity } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  public async Registration(
    @Body() payload: createUserDto
  ): Promise<UserEntity & IAuthToken> {
    const user:any = await this.userService.createUser(payload)
    return {
      ...user,
      token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      })
    }
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  public async login(
    @Body() payload: LoginUserDto
  ): Promise<UserEntity & IAuthToken> {
    const user = await this.userService.loginUser(payload)
    return {
      ...user,
      token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      })
    }
  }
}