import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cadastrar um novo usuário' })
  @ApiBody({
    schema: { example: { email: 'user@teste.com', password: '123' } },
  })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  async register(@Body() body: any) {
    return this.authService.register(body.email, body.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Fazer login e obter o token JWT' })
  @ApiBody({
    schema: { example: { email: 'user@teste.com', password: '123' } },
  })
  @ApiResponse({
    status: 200,
    description: 'Login bem sucedido retorna o access_token.',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }
}
