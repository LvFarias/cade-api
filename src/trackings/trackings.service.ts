import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProvidersService } from '../providers/providers.service.js';
import { CreateTrackingDto } from './dto/create-tracking.dto.js';

@Injectable()
export class TrackingsService {
  constructor(
    private prisma: PrismaService,
    private providersService: ProvidersService
  ) {}

  async createTracking(userId: string, dto: CreateTrackingDto) {
    // 1. Valida se o provedor existe na tabela do banco de dados e está ativo
    const dbProvider = await this.prisma.provider.findUnique({
      where: { id: dto.providerId }
    });

    if (!dbProvider || !dbProvider.active) {
      throw new NotFoundException('Provedor não cadastrado no banco ou temporariamente inativo.');
    }

    // 2. Busca o plugin correspondente em memória
    const plugin = this.providersService.getPlugin(dto.providerId);

    // 3. Aciona a API/Scraping da transportadora através do wrapper
    const trackingData = await plugin.getTracking(dto.trackingCode, dto.document);

    // 4. Salva o rastreio e o histórico de uma vez só usando as transações do Prisma (nested writes)
    const newTracking = await this.prisma.tracking.create({
      data: {
        userId,
        providerId: dto.providerId,
        trackingCode: dto.trackingCode,
        document: dto.document,
        nickname: dto.nickname,
        lastStatus: trackingData.currentStatus,
        lastStatusDescription: trackingData.currentDescription,
        lastCheckedAt: new Date(),
        // Cria os registros na tabela tracking_history de forma relacional
        history: {
          create: trackingData.history.map(event => ({
            status: event.status,
            description: event.description,
            location: event.location,
            occurredAt: event.occurredAt
          }))
        }
      },
      include: {
        history: true // Retorna o objeto já com o histórico populado para o cliente
      }
    });

    return newTracking;
  }
}