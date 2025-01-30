import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


export type ReplyDocument = CommentReply & Document;


@Schema({ timestamps: true })
export class CommentReply {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PostComment', required: true })
  commentId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop()
  userName: string;
  

  @Prop({ required: true })
  commentReply: string;  
}

export const CommentReplySchema = SchemaFactory.createForClass(CommentReply);