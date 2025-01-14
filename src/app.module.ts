import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ContentModule } from './content/content.module';
<<<<<<< HEAD
import { PostsModule } from './posts/posts.module';
=======
import { CommentModule } from './comment/comment.module';
>>>>>>> 8c9309bff53e00f38c7bc1e80f84ccbb19eef52f

@Module({
  imports: [
    // อ่าน config ผ่าน .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(`mongodb://localhost:27017`, {
      user: 'final',
      pass: 'project',
      dbName: 'blogs',
    }),
    AuthModule,
    UserModule,
    ContentModule,
<<<<<<< HEAD
    PostsModule,
=======
    CommentModule,
>>>>>>> 8c9309bff53e00f38c7bc1e80f84ccbb19eef52f
  ],
  controllers: [AppController, ],
  providers: [AppService, ],
  
})
export class AppModule {}