import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/modules/user.module';
import { PostModule } from './modules/posts/modules/post.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleware, IWhiteListItem } from './middlewares';
import config from './orm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UserModule,
    PostModule,
    AuthModule  
  ],
  exports : []
})

export class AppModule implements NestModule {
  public configure (consumer: MiddlewareConsumer): void {
    const authWhiteList: IWhiteListItem[] = [
      { url: '/auth/register' },
      { url: '/auth/login' },
    ];
    consumer
      .apply(AuthMiddleware(authWhiteList))
      .forRoutes({
      path: '*',
      method: RequestMethod.ALL
    });
  }
}