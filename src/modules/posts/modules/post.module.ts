import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { PostController } from "../controllers/post.controller";
import { PostEntity } from "../entities/post.entity";
import { PostService } from "../service/post.service";

@Module({
    imports : [
        TypeOrmModule.forFeature([PostEntity]),
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers:[PostService],
    controllers : [PostController]
})

export class PostModule {}

