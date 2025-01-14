import { IsString, MinLength, IsEmail } from 'class-validator';
export class RegisterDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6, { message: 'รหัสต้องมีความยาวอย่างน้อย 6 ตัวอักษร' })
  readonly password: string;

  @IsString()
  readonly userName: string;

  @IsString()
  readonly gender: string;

  @IsString()
  readonly dateOfBirth: string;
}
