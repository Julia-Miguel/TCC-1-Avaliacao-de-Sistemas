// backend/scripts/populate-tokens.js
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // 1. Encontra todas as avaliações que não têm um token
  const avaliacoesSemToken = await prisma.avaliacao.findMany({
    where: {
      token: null,
    },
  });

  if (avaliacoesSemToken.length === 0) {
    console.log('✨ Todas as avaliações já possuem tokens. Nada a fazer.');
    return;
  }

  console.log(`Encontradas ${avaliacoesSemToken.length} avaliações sem token. Gerando novos tokens...`);

  // 2. Para cada uma, gera e salva um novo token
  for (const avaliacao of avaliacoesSemToken) {
    await prisma.avaliacao.update({
      where: {
        id: avaliacao.id,
      },
      data: {
        token: uuidv4(),
      },
    });
  }

  console.log(`✅ ${avaliacoesSemToken.length} tokens gerados e salvos com sucesso!`);
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro ao gerar os tokens:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });