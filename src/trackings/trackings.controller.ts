import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TrackingsService } from './trackings.service.js';
import { CreateTrackingDto } from './dto/create-tracking.dto.js';

@ApiTags('Rastreios')
@ApiBearerAuth() // Exige o botão de Authorize no Swagger
@UseGuards(AuthGuard('jwt')) // Bloqueia a rota para quem não tem o token JWT
@Controller('trackings')
export class TrackingsController {
  constructor(private readonly trackingsService: TrackingsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar e sincronizar um novo pacote' })
  @ApiResponse({ status: 201, description: 'Pacote cadastrado e sincronizado com a transportadora.' })
  async create(@Request() req: any, @Body() createTrackingDto: CreateTrackingDto) {
    // req.user é injetado automaticamente pela nossa JwtStrategy
    return this.trackingsService.createTracking(req.user.userId, createTrackingDto);
  }
}