import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração de diretórios para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando a semeadura (seed) modular...');

  const seedsDir = path.join(__dirname, 'seeds');

  // Verifica se a pasta existe
  if (!fs.existsSync(seedsDir)) {
    console.log('Nenhuma pasta de seeds encontrada.');
    return;
  }

  // Lê todos os arquivos dentro da pasta seeds
  const files = fs.readdirSync(seedsDir).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of files) {
    console.log(`\n⏳ Executando: ${file}`);
    
    // Importa o arquivo dinamicamente (precisamos do file:// no Windows, mas funciona bem no Mac/Linux assim)
    const seedModule = await import(path.join(seedsDir, file));
    
    // Verifica se o arquivo exporta a função 'seed' e a executa
    if (seedModule.seed) {
      await seedModule.seed(prisma);
    } else {
      console.log(`⚠️ Aviso: O arquivo ${file} não exporta uma função 'seed'.`);
    }
  }

  console.log('\n✅ Todos os provedores foram registrados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });