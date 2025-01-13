import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContentDocument = Content & Document;

@Schema({ timestamps: true })
export class Content {
  @Prop({ required: true })
  user_name: string;

  @Prop()
  post_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  detail: string;

  @Prop()
  description: string;

  @Prop()
  image: string;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
