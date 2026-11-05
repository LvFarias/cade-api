import { PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
  await prisma.provider.upsert({
    where: { id: 'mercado_livre' },
    update: {},
    create: {
      id: 'mercado_livre',
      name: 'Mercado Livre',
      active: true,
      requiresDocument: false,
      configSchema: [
        {
          name: 'order',
          label: 'Número do Pedido',
          type: 'text',
          placeholder: '0000000',
          required: false,
          errorMessage: 'Número do pedido inválido',
        }
      ]
    },
  });
  console.log('📦 Provedor inserido: Mercado Livre');
}