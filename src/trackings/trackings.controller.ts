import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TrackingsService } from './trackings.service.js';
import { CreateTrackingDto } from './dtos/create-tracking.dto.js';
import { UpdateTrackingDto } from './dtos/update-tracking.dto.js';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Rastreios')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('trackings')
export class TrackingsController {
  constructor(private readonly trackingsService: TrackingsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar e sincronizar um novo pacote' })
  @ApiResponse({ status: 201, description: 'Pacote cadastrado e sincronizado com a transportadora.' })
  async create(@Request() req: any, @Body() createTrackingDto: CreateTrackingDto) {
    return this.trackingsService.createTracking(req.user.userId, createTrackingDto);
  }

  @Get()
  async listAll(@Request() req: any) {
    return this.trackingsService.listTrackings(req.user.userId);
  }

  @Get(':id')
  async getDetails(@Request() req: any, @Param('id') id: string) {
    return this.trackingsService.getTrackingDetails(req.user.userId, id);
  }

  @Patch(':id')
  async updateNickname(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateTrackingDto) {
    return this.trackingsService.updateNickname(req.user.userId, id, dto.nickname);
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.trackingsService.deleteTracking(req.user.userId, id);
  }
}