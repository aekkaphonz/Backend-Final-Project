import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

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

  @Prop({ required: true  })
  image: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: string[]; 
}

export const ContentSchema = SchemaFactory.createForClass(Content);
