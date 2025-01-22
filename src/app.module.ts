import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ContentModule } from './content/content.module';
import { CommentModule } from './comment/comment.module';
import { PostsModule } from './posts/posts.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(`mongodb://localhost:27017`, {
      user: 'final',
      pass: 'project',
      dbName: 'blogs',
    }),
    //AuthModule,
    UserModule,
    ContentModule,
    CommentModule,
    PostsModule,
    ImageModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
