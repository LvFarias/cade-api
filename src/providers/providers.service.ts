import { Injectable, BadRequestException } from '@nestjs/common';
import { ProviderPlugin } from './interfaces/provider-plugin.interface.js';
import { CorreiosProvider } from './implementations/correios.provider.js';

@Injectable()
export class ProvidersService {
  private registry: Map<string, ProviderPlugin> = new Map();

  constructor() {
    // Registro de plugins ativos (pode ser automatizado depois)
    this.registry.set('correios', new CorreiosProvider());
  }

  getPlugin(providerId: string): ProviderPlugin {
    const plugin = this.registry.get(providerId);
    if (!plugin) {
      throw new BadRequestException(`Provedor '${providerId}' não suportado ou inativo nos plugins.`);
    }
    return plugin;
  }
}