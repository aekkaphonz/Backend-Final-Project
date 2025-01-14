import { IsString, MinLength, IsEmail } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'รหัสต้องมีความยาวอย่างน้อย 6 ตัวอักษร' })
  password: string;

  @IsString()
  userName: string;

  @IsString()
  gender: string;

  @IsString()
  dateOfBirth: string;
}
