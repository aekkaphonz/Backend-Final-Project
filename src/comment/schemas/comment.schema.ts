import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommentDocument = PostComment & Document;
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
@Schema({ timestamps: true })
export class PostComment {
  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  comment: string;
  @Prop({ required: true })
  comment: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: [String], default: [] })
  replies: string[];
}

export const CommentSchema = SchemaFactory.createForClass(PostComment);
export const CommentSchema = SchemaFactory.createForClass(PostComment);
