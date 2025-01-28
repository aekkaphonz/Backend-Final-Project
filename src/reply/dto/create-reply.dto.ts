import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyDto {
  @ApiProperty({
    description: 'Comment id ',
    example: '678db93685ad6c7405e8fd97',
  })
  commentId: Types.ObjectId;

  @ApiProperty({ description: 'User id ', example: '678dccaf5cd2a561efb02d45' })
  userId: Types.ObjectId;

  @ApiProperty({
    description: 'The comment text',
    example: 'This is a sample comment',
  })
  @IsNotEmpty()
  @IsString()
  commentReply: string;
}
