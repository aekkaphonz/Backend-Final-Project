import { forwardRef, Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { Content, ContentSchema } from './schemas/content.schema';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from 'src/user/user.module';
import { CommentModule } from 'src/comment/comment.module';
import { CommentSchema, PostComment } from 'src/comment/schemas/comment.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Content.name, schema: ContentSchema },
      { name: PostComment.name, schema: CommentSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => CommentModule),
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService, MongooseModule],
})
export class ContentModule {}
