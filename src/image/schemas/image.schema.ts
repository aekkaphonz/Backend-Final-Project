import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';


export type imageStorageDocument = ImageStorage & Document;

@Schema({ timestamps: true })
export class ImageStorage{
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,index: true  }) 
    userId: string;

    @Prop({ 
        required: true, 
        type: [String], 
        validate: {
          validator: (images: string[]) => images.every(img => typeof img === 'string'),
          message: 'profileImage must be an array of strings (Base64).',
        }
      })  
      profileImage: string[]; 
    
}

export const imageStorageSchema = SchemaFactory.createForClass(ImageStorage);
