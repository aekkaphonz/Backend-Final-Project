import {  IsMongoId,IsNotEmpty, IsOptional, isString, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContentDto {


  @ApiProperty({description : 'Your id ', example: "678db93685ad6c7405e8fd97"})
  
  userId: string;

  @ApiProperty({description : 'Title ', example: "This is title"})
  @IsString()
  @IsNotEmpty()
   title: string;

  @ApiProperty({description : 'Detail ', example: "Test detail"})
  @IsString()
  @IsNotEmpty()
   detail: string;

  @ApiProperty({description : 'Description', example: "This is description"})
   description: string;

  @ApiProperty({description : 'Your image', example: "example.png"})
  @IsOptional()
   postImage?: string;
}
