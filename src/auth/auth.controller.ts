import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service.js'; // Uso do .js padrão do ESM do projeto[cite: 5]
import { RegisterDto } from './dtos/register.dto.js';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cadastrar um novo usuário' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  async register(@Body() dto: RegisterDto) {
    if (dto.password !== dto.passwordConfirmation) {
      throw new BadRequestException('As senhas não coincidem.');
    }
    return this.authService.register(dto);
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Request() req: any) {
    return this.authService.getUserProfile(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async updateProfile(@Request() req: any, @Body() body: any) {
    return this.authService.updateProfile(req.user.userId, body);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  async deleteAccount(@Request() req: any) {
    return this.authService.anonymizeUser(req.user.userId);
  }
}
