import { IsString, IsEmail, IsOptional, Matches, MinLength, ValidateIf } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message: 'A senha deve conter pelo menos 8 dígitos, letras maiúsculas, minúsculas, números e um caractere especial.',
  })
  password: string;

  @IsString()
  passwordConfirmation: string;

  @IsOptional()
  @IsString()
  deviceId?: string;
}