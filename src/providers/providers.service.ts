import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { ProviderPlugin } from './interfaces/provider-plugin.interface.js';
import { PrismaService } from '../prisma/prisma.service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@Injectable()
export class ProvidersService implements OnModuleInit {
  private registry: Map<string, ProviderPlugin> = new Map();

  // Injetamos o Prisma para acessar a tabela de provedores
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.loadPlugins();
  }

  private async loadPlugins() {
    const implementationsDir = path.join(__dirname, 'implementations');

    if (!fs.existsSync(implementationsDir)) {
      console.warn('⚠️ Diretório de plugins não encontrado.');
      return;
    }

    // Lê todos os arquivos .ts ou .js da pasta implementations
    const files = fs
      .readdirSync(implementationsDir)
      .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of files) {
      const fileUrl = pathToFileURL(path.join(implementationsDir, file)).href;
      const module = await import(fileUrl);

      // Procura pelas classes exportadas dentro do arquivo
      for (const exportedItem of Object.values(module)) {
        // Verifica se o item exportado é uma classe e possui o método exigido pelo contrato
        if (
          typeof exportedItem === 'function' &&
          exportedItem.prototype &&
          'getTracking' in exportedItem.prototype
        ) {
          // Extrai o ID do nome do arquivo (ex: 'correios.provider.ts' vira 'correios')
          const providerId = file.split('.')[0];

          // Instancia a classe e adiciona ao mapa
          this.registry.set(providerId, new (exportedItem as any)());
          console.log(`🔌 Plugin registrado automaticamente: ${providerId}`);
        }
      }
    }
  }

  getPlugin(providerId: string): ProviderPlugin {
    const plugin = this.registry.get(providerId);
    if (!plugin) {
      throw new BadRequestException(
        `Provedor '${providerId}' não suportado ou inativo nos plugins.`,
      );
    }
    return plugin;
  }
  // Novo método para o front-end
  async getAvailableProviders() {
    return this.prisma.provider.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        requiresDocument: true,
        configSchema: true, // Retorna o JSON com a estrutura de campos extras[cite: 2]
      },
      orderBy: { name: 'asc' },
    });
  }
}
