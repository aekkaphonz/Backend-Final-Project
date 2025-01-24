import {  IsMongoId,IsNotEmpty, IsOptional, isString, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContentDto {

  readonly userId?: Types.ObjectId;
  
  @IsString()
  @IsNotEmpty()
   title: string;

  @ApiProperty({description : 'Detail ', example: "Test detail"})
  @IsString()
  @IsNotEmpty()
   detail: string;


  readonly description: string;

 
  readonly image: string;
}
