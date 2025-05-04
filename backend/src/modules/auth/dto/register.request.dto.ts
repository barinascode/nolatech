import { IsEmail, IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export default class RegisterRequestDTO {
    
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  first_name!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  last_name!: string;

  @IsNotEmpty()
  @IsEmail({})
  @MaxLength(255)
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password!: string;

  }
