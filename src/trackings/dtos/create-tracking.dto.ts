import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrackingDto {
  @ApiProperty({ example: 'correios', description: 'ID do provedor (plugin)' })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ example: 'BR123456789X', description: 'Código de rastreio' })
  @IsString()
  @IsNotEmpty()
  trackingCode: string;

  @ApiPropertyOptional({ example: '12345678900', description: 'CPF/CNPJ se o provedor exigir' })
  @IsString()
  @IsOptional()
  document?: string;

  @ApiProperty({ example: 'Meu Tênis', description: 'Apelido para controle pessoal' })
  @IsString()
  @IsNotEmpty()
  nickname: string;
}