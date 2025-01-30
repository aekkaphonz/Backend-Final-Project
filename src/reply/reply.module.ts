import { forwardRef, Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { CommentReply, CommentReplySchema } from './schemas/reply.schema';
import { CommentModule } from 'src/comment/comment.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, PostComment } from 'src/comment/schemas/comment.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommentReply.name, schema: CommentReplySchema },
      { name: PostComment.name, schema: CommentSchema },
    ]),
    forwardRef(() => CommentModule),
    forwardRef(() => UserModule),
  ],
  controllers: [ReplyController],
  providers: [ReplyService],
  exports: [ReplyService, MongooseModule],
})
export class ReplyModule {}
