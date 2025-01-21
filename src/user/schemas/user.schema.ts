import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

import * as bcrypt from 'bcrypt';
import { Content } from 'src/content/schemas/content.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  // @Prop({ required: true })
  // password: string; เก็บไว้เขียน validate

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: false })
  userName: string;

  @Prop({ required: false })
  gender: string;

  @Prop({ required: false })
  dateOfBirth: string;

  @Prop()
   googleId: string;
   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }] }) 
   content: Content[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
