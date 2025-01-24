import { ApiProperty } from '@nestjs/swagger';

export class GetContentDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  detail: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  postImage: string;

  @ApiProperty()
  comment: [];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
