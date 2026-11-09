import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { loggerContext } from './logger.context.js';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const store = new Map<string, any>();
    store.set('traceId', uuidv4());
    store.set('initTime', Date.now());

    // Todo o ciclo de vida desta requisição rodará dentro deste contexto
    loggerContext.run(store, () => {
      next();
    });
  }
}