import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWT_KEY } from 'config';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/modules/user.module';
import { UserService } from '../user/service/user.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    JwtModule.register({secret: JWT_KEY})
    ],
  controllers: [AuthController],
  providers : [UserService]
})
export class AuthModule {}