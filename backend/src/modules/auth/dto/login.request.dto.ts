import { IsEmail, IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export default class LoginRequestDTO {

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @MaxLength(255)
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(20)
  password!: string;
  
}