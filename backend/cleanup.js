// backend/jest-setup.js
const { execSync } = require('child_process');
const { prisma } = require('./src/database/client.js'); // Usando require e o caminho para o seu client

// Executa uma vez antes de todos os testes começarem
beforeAll(() => {
  // Define a variável de ambiente para a base de dados de teste
  process.env.DATABASE_URL = "file:./test.db";
  // Roda as migrations para garantir que o schema está atualizado
  execSync('npx prisma migrate deploy');
});

// Executa antes de CADA teste
beforeEach(async () => {
  // Limpa os dados de todas as tabelas
  // IMPORTANTE: A ordem importa! Comece pelas tabelas com chaves estrangeiras.
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

// Executa uma vez depois de todos os testes terminarem
afterAll(async () => {
  await prisma.$disconnect();
});