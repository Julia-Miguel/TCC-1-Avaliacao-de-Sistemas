// Importe o PrismaClient e o módulo crypto para gerar UUIDs
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // 1. Encontre todos os usuários que ainda não têm um token (o campo está nulo)
  const usersWithoutToken = await prisma.usuario.findMany({
    where: {
      token: null,
    },
  });

  if (usersWithoutToken.length === 0) {
    console.log('✅ Todos os usuários já possuem tokens. Nenhuma ação necessária.');
    return;
  }

  console.log(`Encontrados ${usersWithoutToken.length} usuários sem token. Gerando tokens agora...`);

  // 2. Para cada usuário encontrado, gere um novo UUID e atualize o registro
  for (const user of usersWithoutToken) {
    await prisma.usuario.update({
      where: {
        id: user.id,
      },
      data: {
        token: randomUUID(), // Gera um token aleatório e seguro
      },
    });
    console.log(`- Token gerado para o usuário: ${user.nome} (ID: ${user.id})`);
  }

  console.log('🚀 Processo concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
