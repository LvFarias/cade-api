import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service.js';
import { ProvidersController } from './providers.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  providers: [ProvidersService, PrismaService],
  exports: [ProvidersService],
  controllers: [ProvidersController],
})
export class ProvidersModule {}
