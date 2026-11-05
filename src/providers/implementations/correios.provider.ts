import { ProviderPlugin, TrackingResult } from '../interfaces/provider-plugin.interface.js';

export class CorreiosProvider implements ProviderPlugin {
  async getTracking(trackingCode: string, document?: string): Promise<TrackingResult> {
    // Aqui entraria o axios/fetch para a API real dos Correios
    // Estamos simulando o retorno padronizado:
    return {
      currentStatus: 'EM_TRANSITO',
      currentDescription: 'Objeto em trânsito - por favor aguarde',
      history: [
        {
          status: 'POSTADO',
          description: 'Objeto postado após o horário limite da agência',
          location: 'São Paulo - SP',
          occurredAt: new Date(),
        }
      ]
    };
  }
}