import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service.js';

@Module({
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
