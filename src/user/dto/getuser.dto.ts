import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty()
   _id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  dateOfBirth: string;

  @ApiProperty()
  content : [];

}
