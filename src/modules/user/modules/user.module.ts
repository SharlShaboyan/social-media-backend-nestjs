import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "../controllers/user.controller";
import { UserEntity } from "../entities/user.entity";
import { UserService } from "../service/user.service";

@Module({
    imports : [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserService],
    controllers : [UserController],
    
})

export class UserModule {}

