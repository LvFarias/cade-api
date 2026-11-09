import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CadeLogger } from './logger.service.js';
import { loggerContext } from './logger.context.js';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: CadeLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    
    // Log imediato sinalizando o início do request no servidor
    this.logger.log(`Started {${url}, ${method}} request`, 'RequestLogger');

    return next.handle().pipe(
      tap(() => {
        const store = loggerContext.getStore();
        const initTime = store?.get('initTime') || Date.now();
        const duration = Date.now() - initTime;
        
        // Log de encerramento registrando a duração em milissegundos
        this.logger.log(`Finished {${url}, ${method}} request`, 'RequestLogger', duration);
      }),
    );
  }
}