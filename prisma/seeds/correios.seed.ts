import { PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
  await prisma.provider.upsert({
    where: { id: 'correios' },
    update: {}, // Mantém como está se já existir
    create: {
      id: 'correios',
      name: 'Correios',
      active: true,
      requiresDocument: false,
    },
  });
  console.log('📦 Provedor inserido: Correios');
}