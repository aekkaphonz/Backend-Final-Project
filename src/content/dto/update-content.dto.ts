import { IsNotEmpty, IsOptional, IsString, IsArray, } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateContentDto {

  @ApiProperty()
  @IsOptional()
  userId?: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  detail: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  postImage: string;

  @ApiProperty({ type: [String], required: false }) // ✅ เพิ่ม tags
    @IsArray()
    @IsOptional()
    tags?: string[];
  
}
