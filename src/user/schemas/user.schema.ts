import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  // @Prop({ required: true })
  // password: string;
  @Prop()
   password: string;

 
   @Prop({ required: false })  // ทำให้เป็น optional
   userName: string;
 
   @Prop({ required: false })  // ทำให้เป็น optional
   gender: string;
 
   @Prop({ required: false })  // ทำให้เป็น optional
   dateOfBirth: string;

  @Prop()
   googleId: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});