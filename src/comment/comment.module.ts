import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostComment, CommentSchema } from './schemas/comment.schema';
import { ContentModule } from 'src/content/content.module';
import { ReplyModule } from 'src/reply/reply.module';
import {
  CommentReply,
  CommentReplySchema,
} from 'src/reply/schemas/reply.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostComment.name, schema: CommentSchema },
      { name: CommentReply.name, schema: CommentReplySchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => ContentModule),
    forwardRef(() => ReplyModule),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
