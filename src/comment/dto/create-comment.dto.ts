import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The ID of the user creating the comment',
    example: '678db93685ad6c7405e8fd97',
    type: String,
  })
  @IsMongoId() // Ensures the ID is a valid MongoDB ObjectId
  @IsNotEmpty()
  readonly userId: Types.ObjectId;

  @ApiProperty({
    description: 'The ID of the post to which the comment belongs',
    example: '678dccaf5cd2a561efb02d45',
    type: String,
  })
  @IsMongoId() // Ensures the ID is a valid MongoDB ObjectId
  @IsNotEmpty()
  readonly postId: Types.ObjectId;

  @ApiProperty({
    description: 'The comment text',
    example: 'This is a sample comment',
  })
  @IsNotEmpty()
  @IsString()
  readonly comment: string;
}
