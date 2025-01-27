import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PostComment } from 'src/comment/schemas/comment.schema';

export type ContentDocument = Content & Document;

@Schema({ timestamps: true })
export class Content {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }) 
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  detail: string;

  @Prop()
  description: string;

  @Prop()
  postImage: string; 

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: PostComment[]; 
}

export const ContentSchema = SchemaFactory.createForClass(Content);
