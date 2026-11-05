import type { ProviderPlugin, TrackingResult, TrackingEvent } from '../interfaces/provider-plugin.interface.js';

export class CorreiosProvider implements ProviderPlugin {
  // Novo endpoint POST da Wonca Labs
  private readonly apiUrl = 'https://api-labs.wonca.com.br/wonca.labs.v1.LabsService/Track';

  async getTracking(trackingCode: string, document?: string): Promise<TrackingResult> {
    const token = process.env.SITERASTREIO_TOKEN;

    if (!token) {
      console.warn('⚠️ SITERASTREIO_TOKEN não encontrado no .env. Configure-o para obter dados reais.');
      throw new Error('Chave de API do provedor não configurada.');
    }

    try {
      // Disparando o POST conforme o cURL da documentação
      console.log(`🔌 Consultando Correios para o código: ${trackingCode} com curl:\n
        curl -X POST ${this.apiUrl} \\
          -H "Content-Type: application/json" \\
          -H "Authorization: Apikey ${token}" \\
          -d '{"code": "${trackingCode}", "carrier": "CARRIER_CORREIOS"}'
      `);
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Apikey ${token}`,
        },
        body: JSON.stringify({
          code: trackingCode,
          carrier: 'CARRIER_CORREIOS'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erro de comunicação com o provedor: ${response.status}`);
      }

      const data = await response.json();

      // Dependendo de como a Wonca retorna (geralmente data.events ou data.eventos),
      // fazemos um fallback dinâmico para cobrir ambos
      const rawEvents = data.events || data.eventos || [];

      if (rawEvents.length === 0) {
        return {
          currentStatus: 'POSTADO',
          currentDescription: 'Objeto aguardando processamento no sistema dos Correios.',
          history: []
        };
      }

      // Mapeia a resposta para o TrackingEvent esperado pelo "Cade?"[cite: 2]
      const history: TrackingEvent[] = rawEvents.map((evento: any) => ({
        status: this.normalizeStatus(evento.status),
        description: evento.description || evento.descricao || evento.status,
        location: evento.location || evento.local || 'Origem não informada',
        occurredAt: this.parseDate(evento.date || evento.data, evento.time || evento.hora),
      }));

      const latestEvent = history[0];

      return {
        currentStatus: latestEvent.status,
        currentDescription: latestEvent.description,
        history,
      };

    } catch (error) {
      console.error(`🔌 Falha no plugin Correios [${trackingCode}]:`, error);
      throw new Error('Falha ao rastrear o objeto nos Correios. Tente novamente mais tarde.');
    }
  }

  // Mantém a normalização para o padrão do banco de dados do "Cade?"[cite: 2]
  private normalizeStatus(rawStatus: string): string {
    const status = (rawStatus || '').toUpperCase();
    if (status.includes('ENTREGUE')) return 'ENTREGUE';
    if (status.includes('SAIU PARA ENTREGA')) return 'SAI_PARA_ENTREGA';
    if (status.includes('TRÂNSITO') || status.includes('ENCAMINHADO')) return 'EM_TRANSITO';
    if (status.includes('POSTADO')) return 'POSTADO';
    if (status.includes('AGUARDANDO RETIRADA')) return 'AGUARDANDO_RETIRADA';
    return 'EXCECAO';
  }

  // Previne falhas de parsing de data caso a Wonca retorne em formatos diferentes (ISO vs DD/MM/YYYY)
  private parseDate(dateStr?: string, timeStr?: string): Date {
    if (!dateStr) return new Date();
    
    // Se já vier no formato ISO 8601 (ex: "2026-11-05T14:30:00Z")
    if (dateStr.includes('T')) return new Date(dateStr);
    
    const time = timeStr || '00:00';
    if (dateStr.includes('/')) {
      const [dia, mes, ano] = dateStr.split('/');
      return new Date(`${ano}-${mes}-${dia}T${time}:00-03:00`);
    }
    
    return new Date(`${dateStr}T${time}:00-03:00`);
  }
}