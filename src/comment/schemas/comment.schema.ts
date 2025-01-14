  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import mongoose, { Document } from 'mongoose';

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

    @Prop({ required: true })
    comment: string;

  //   @Prop({ default: Date.now })
  //   createdAt: Date;


  }

  export const CommentSchema = SchemaFactory.createForClass(PostComment);
