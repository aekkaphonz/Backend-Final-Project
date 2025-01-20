import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  tags: string[];

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  commentCount: number;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  images: string[];

  @Prop({ required: true })
  userId: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
