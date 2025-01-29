import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateCommentDto {
  @ApiProperty({ description: 'Your id ', example: '678db93685ad6c7405e8fd97' })
  userId?: Types.ObjectId;
  @ApiProperty({ description: 'Post id ', example: '678dccaf5cd2a561efb02d45' })
  postId?: Types.ObjectId;

  @ApiProperty({ description: 'Your name', example: 'Admin' })
  userName: string;
  
  @ApiProperty({ description: 'Your comment ', example: 'Edit comment' })
  comment: string;
}
