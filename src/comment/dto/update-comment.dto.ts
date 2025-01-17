import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class AddCommentDto {
  @IsNotEmpty()
  @IsMongoId()
  postId: string;

  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsString()
  comment: string;
}

export class UpdateCommentDto {
  @IsNotEmpty()
  @IsString()
  comment: string;
}
