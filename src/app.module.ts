import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ProvidersModule } from './providers/providers.module.js';
import { TrackingsModule } from './trackings/trackings.module.js';
import { LoggerModule } from './logger/logger.module.js';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggerInterceptor } from './logger/logger.interceptor.js';
import { LoggerMiddleware } from './logger/logger.middleware.js';

@Module({
  imports: [LoggerModule, AuthModule, ProvidersModule, TrackingsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Aplica o gerador de TraceId para tudo
  }
}
