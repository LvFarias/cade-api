import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProvidersService } from './providers.service.js';

@ApiTags('Provedores')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar provedores ativos e seus schemas de campos extras' })
  async list() {
    return this.providersService.getAvailableProviders();
  }
}