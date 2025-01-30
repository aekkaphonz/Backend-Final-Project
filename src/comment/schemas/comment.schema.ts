import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { commentReply } from 'src/reply/schemas/reply.schema';

export type CommentDocument = PostComment & Document;

@Schema({ timestamps: true })
export class PostComment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true,
  })
  postId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
  
  @Prop()
  userName: string;


  @Prop({ required: true })
  comment: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }] })
  reply : commentReply[]  


}

export const CommentSchema = SchemaFactory.createForClass(PostComment);