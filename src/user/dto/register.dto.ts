import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsEmail } from 'class-validator';
export class RegisterDto {
  @ApiProperty({description : 'Your email ', example: "test@gmail.com"})
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({description : 'Your password ', example: "test123"})
  @IsString()
  @MinLength(6, { message: 'รหัสต้องมีความยาวอย่างน้อย 6 ตัวอักษร' })
  readonly password: string;

  @ApiProperty({description : 'Your username ', example: "aekkaphon"})
  @IsString()
  readonly userName: string;

  @ApiProperty({description : 'Gender ', example: "ชาย"})
  @IsString()
  readonly gender: string;

  @ApiProperty({description : 'Your birth ', example: "29/06/2002"})
  readonly dateOfBirth: string;

  // @ApiProperty()
  // @IsString()
  // profileImage: string;
}

export class RegisterResponseDto {
  @ApiProperty({example: "678db4c909bdfce98e1384b4"})
  readonly _id: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly userName: string;

  @ApiProperty()
  readonly gender: string;

  @ApiProperty()
  readonly dateOfBirth: string;


}
