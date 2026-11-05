import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ProvidersModule } from './providers/providers.module.js';
import { TrackingsModule } from './trackings/trackings.module.js';

@Module({
  imports: [AuthModule, ProvidersModule, TrackingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
