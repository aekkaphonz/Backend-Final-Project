import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'Your id ', example: '678db93685ad6c7405e8fd97' })
  readonly userId?: Types.ObjectId;

  @ApiProperty({ description: 'Post id ', example: '678dccaf5cd2a561efb02d45' })
  readonly postId?: Types.ObjectId;

  @ApiProperty({ description: 'Your comment ', example: 'This is comment ei' })
  @IsNotEmpty()
  @IsString()
  readonly comment: string;
}
