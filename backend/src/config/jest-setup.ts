// backend/src/config/jest-setup.ts
import { execSync } from 'child_process';
import { prisma } from '../database/client';

// Este bloco executa uma vez, antes de todos os testes começarem
beforeAll(() => {
  // Executa o nosso script que prepara a base de dados de teste com as tabelas mais recentes
  execSync('npm run test:migrate');
});

// Este bloco executa antes de CADA teste
beforeEach(async () => {
  // Limpa os dados de todas as tabelas para garantir que os testes sejam independentes.
  // IMPORTANTE: Adicione um `deleteMany()` para cada uma das suas tabelas.
  // A ordem importa: comece pelas tabelas que têm chaves estrangeiras.
  await prisma.resposta.deleteMany();
  await prisma.opcao.deleteMany();
  await prisma.quePerg.deleteMany();
  await prisma.pergunta.deleteMany();
  await prisma.usuAval.deleteMany();
  await prisma.avaliacao.deleteMany();
  await prisma.questionario.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.empresa.deleteMany();
});

// Este bloco executa uma vez, depois de todos os testes terminarem
afterAll(async () => {
  // Fecha a conexão com a base de dados para evitar que o processo fique "pendurado"
  await prisma.$disconnect();
});