import { IsNotEmpty, isString, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateContentDto {

  readonly userId?: Types.ObjectId;
  
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly detail: string;


  readonly description: string;

 
  readonly image: string;
}
