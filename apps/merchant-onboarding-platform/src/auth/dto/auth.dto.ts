import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { SecurityConfig } from '../configs/auth.config';

export class LoginCredentialsDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'User@123',
    description: 'User password',
  })
  @IsNotEmpty()
  @IsStrongPassword(SecurityConfig.PASSWORD_RULES)
  password: string;
}
