import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsEmail, Matches } from 'class-validator';
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

  @IsString()
  readonly dateOfBirth: string;
}
