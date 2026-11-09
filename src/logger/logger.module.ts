import { Module, Global } from '@nestjs/common';
import { CadeLogger } from './logger.service.js';

@Global()
@Module({
  providers: [CadeLogger],
  exports: [CadeLogger],
})
export class LoggerModule {}