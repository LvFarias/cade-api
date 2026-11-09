import { AsyncLocalStorage } from 'async_hooks';

// Armazena um mapa com o traceId e o timestamp de início para a requisição atual
export const loggerContext = new AsyncLocalStorage<Map<string, any>>();
