import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProvidersService } from '../providers/providers.service.js';
import { CreateTrackingDto } from './dtos/create-tracking.dto.js';

@Injectable()
export class TrackingsService {
  constructor(
    private prisma: PrismaService,
    private providersService: ProvidersService,
  ) {}

  async createTracking(userId: string, dto: CreateTrackingDto) {
    // 1. Valida se o provedor existe na tabela do banco de dados e está ativo
    const dbProvider = await this.prisma.provider.findUnique({
      where: { id: dto.providerId },
    });

    if (!dbProvider || !dbProvider.active) {
      throw new NotFoundException(
        'Provedor não cadastrado no banco ou temporariamente inativo.',
      );
    }

    // 2. Busca o plugin correspondente em memória
    const plugin = this.providersService.getPlugin(dto.providerId);

    // 3. Aciona a API/Scraping da transportadora através do wrapper
    const trackingData = await plugin.getTracking(
      dto.trackingCode,
      dto.document,
    );

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
          create: trackingData.history.map((event) => ({
            status: event.status,
            description: event.description,
            location: event.location,
            occurredAt: event.occurredAt,
          })),
        },
      },
      include: {
        history: true, // Retorna o objeto já com o histórico populado para o cliente
      },
    });

    return newTracking;
  }

  async listTrackings(userId: string) {
    return this.prisma.tracking.findMany({
      where: { userId },
      select: {
        id: true,
        nickname: true,
        lastStatus: true,
        lastCheckedAt: true,
        providerId: true,
      },
      orderBy: { lastCheckedAt: 'desc' },
    });
  }

  async getTrackingDetails(userId: string, trackingId: string) {
    const tracking = await this.prisma.tracking.findFirst({
      where: { id: trackingId, userId },
      include: {
        history: {
          orderBy: { occurredAt: 'desc' },
        },
        provider: {
          select: { name: true },
        },
      },
    });

    if (!tracking) throw new NotFoundException('Rastreio não encontrado.');
    return tracking;
  }

  async updateNickname(userId: string, trackingId: string, nickname: string) {
    const exists = await this.prisma.tracking.findFirst({
      where: { id: trackingId, userId },
    });
    if (!exists) throw new NotFoundException('Rastreio não encontrado.');

    return this.prisma.tracking.update({
      where: { id: trackingId },
      data: { nickname },
      select: { id: true, nickname: true },
    });
  }

  async deleteTracking(userId: string, trackingId: string) {
    const exists = await this.prisma.tracking.findFirst({
      where: { id: trackingId, userId },
    });
    if (!exists) throw new NotFoundException('Rastreio não encontrado.');

    await this.prisma.tracking.delete({
      where: { id: trackingId },
    });

    return { message: 'Rastreio removido com sucesso.' };
  }
}
