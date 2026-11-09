import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { format } from 'winston';
import { loggerContext } from './logger.context.js';

// Cores ANSI que o NestJS usa
const clc = {
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

@Injectable()
export class CadeLogger implements LoggerService {
  private winstonLogger: winston.Logger;

  constructor() {
    // 1. Formato invisível para provedores externos (CloudWatch/Graylog)
    const jsonFormat = format.combine(
      format.timestamp(),
      format.json()
    );

    // 2. Formato idêntico ao padrão NestJS para o console local
    const nestConsoleFormat = format.printf(({ context, level, message, ms }) => {
      const pid = process.pid;
      const date = new Date().toLocaleString('en-US', {
        month: '2-digit', day: '2-digit', year: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
      });

      // Aplica as cores exatas do Nest
      let colorizedLevel = level.toUpperCase();
      if (level === 'info') colorizedLevel = clc.green('LOG');
      if (level === 'warn') colorizedLevel = clc.yellow('WARN');
      if (level === 'error') colorizedLevel = clc.red('ERROR');

      const colorizedContext = context ? clc.yellow(`[${context}] `) : '';
      const colorizedMessage = level === 'error' ? clc.red(message as string) : clc.green(message as string);
      
      // O ms vem do interceptor ou é injetado dinamicamente
      const durationStr = ms ? clc.yellow(` +${ms}ms`) : '';

      return `[Nest] ${pid}  - ${date}     ${colorizedLevel} ${colorizedContext}${colorizedMessage}${durationStr}`;
    });

    this.winstonLogger = winston.createLogger({
      level: 'info',
      transports: [
        // Console local (Formato NestJS com cores)
        new winston.transports.Console({
          format: format.combine(
            format.ms(), // Habilita a métrica interna de +ms para logs sequenciais
            nestConsoleFormat
          )
        }),
        // CloudWatch / Graylog (Formato JSON puro mantendo a integridade)
        // new WinstonCloudWatch({ logGroupName: 'cade-api', format: jsonFormat })
      ],
    });
  }

  private getTraceId(): string {
    const store = loggerContext.getStore();
    return store?.get('traceId') || 'system-init';
  }

  log(message: string, context?: string, ms?: number) {
    this.winstonLogger.info({ message, context, ms, traceId: this.getTraceId() });
  }

  error(message: string, trace?: string, context?: string) {
    this.winstonLogger.error({ message, context, trace, traceId: this.getTraceId() });
  }

  warn(message: string, context?: string) {
    this.winstonLogger.warn({ message, context, traceId: this.getTraceId() });
  }
}