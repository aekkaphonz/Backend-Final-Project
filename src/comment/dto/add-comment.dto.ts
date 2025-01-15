import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class AddCommentDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly postId: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly comment: string;
}
