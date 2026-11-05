import { Module } from '@nestjs/common';
import { TrackingsService } from './trackings.service.js';
import { TrackingsController } from './trackings.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProvidersService } from '../providers/providers.service.js';

@Module({
  providers: [TrackingsService, PrismaService, ProvidersService],
  controllers: [TrackingsController],
})
export class TrackingsModule {}
