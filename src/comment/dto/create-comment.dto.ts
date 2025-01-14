import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
    
  readonly userId?: Types.ObjectId;
  readonly postId?: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  
  readonly comment: string;

}
