import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class GetCommentDto {
  @ApiProperty({ description: 'Comment id ', example: '678db93685ad6c7405e8fd23' })
  _id?: string;

  @ApiProperty({ description: 'Your id ', example: '678db93685ad6c7405e8fd97' })
  userId?: Types.ObjectId;

  @ApiProperty({ description: 'Post id ', example: '678dccaf5cd2a561efb02d45' })
  postId?: Types.ObjectId;

  @ApiProperty({ description: 'Your comment ', example: 'This is comment ei' })
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updateAt: string;
}
