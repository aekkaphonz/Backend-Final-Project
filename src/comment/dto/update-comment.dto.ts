import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateCommentDto {
  userId?: Types.ObjectId;
  postId?: Types.ObjectId;
  comment: string;
}
