// backend/cleanup.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando script de limpeza de registros órfãos...');

  // 1. Pega todas as conexões entre questionários e perguntas.
  const todasAsConexoes = await prisma.quePerg.findMany();  
  
  let orfaosEncontrados = 0;

  console.log(`Verificando ${todasAsConexoes.length} conexões...`);

  // 2. Itera sobre cada conexão para verificar sua validade.
  for (const conexao of todasAsConexoes) {
    // 3. Para cada conexão, tenta encontrar a pergunta correspondente.
    const perguntaExiste = await prisma.pergunta.findUnique({
      where: { id: conexao.perguntaId },
    });

    // 4. Se a pergunta NÃO existe, a conexão é órfã e deve ser removida.
    if (!perguntaExiste) {
      orfaosEncontrados++;
      console.log(`--> Conexão órfã encontrada (ID: ${conexao.id})! Apontava para a Pergunta ID ${conexao.perguntaId} (inexistente). Deletando...`);
      
      await prisma.quePerg.delete({
        where: { id: conexao.id },
      });
    }
  }

  if (orfaosEncontrados > 0) {
    console.log(`\nLimpeza concluída! ${orfaosEncontrados} registros órfãos foram removidos.`);
  } else {
    console.log('\nNenhum registro órfão encontrado. Seu banco de dados está consistente!');
  }
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro durante a limpeza:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Fecha a conexão com o banco de dados
    await prisma.$disconnect();
  });