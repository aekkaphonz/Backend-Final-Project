import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsEmail } from 'class-validator';
export class CreateAuthDto {
  @ApiProperty({description : 'Your email '})
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({description : 'Your password '})
  @IsString()
  @MinLength(6, { message: 'รหัสต้องมีความยาวอย่างน้อย 6 ตัวอักษร' })
  readonly password: string;

  @ApiProperty({description : 'Your username '})
  @IsString()
  readonly userName: string;

  @ApiProperty({description : 'Gender '})
  @IsString()
  readonly gender: string;

  @ApiProperty({description : 'Your birth '})
  readonly dateOfBirth: string;

  // @ApiProperty()
  // @IsString()
  // profileImage: string;
}
