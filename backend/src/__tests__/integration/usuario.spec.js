import request from 'supertest';
import { app } from '../../server.js';
import { PrismaClient, TipoUsuario } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('User Routes', () => {

  // Limpa o banco antes de cada teste
  beforeEach(async () => {
    // A ordem de exclusão é crucial para evitar erros de chave estrangeira
    await prisma.resposta.deleteMany();
    await prisma.usuAval.deleteMany();
    await prisma.quePerg.deleteMany();
    await prisma.avaliacao.deleteMany();
    await prisma.pergunta.deleteMany();
    await prisma.questionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.empresa.deleteMany();
  });

  // Desconecta do banco após todos os testes
  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Teste 1: Criação via API
  it('should be able to create a new user', async () => {
    const userData = {
      nome: 'Julia Teste',
      email: 'julia.teste@example.com',
      senha: 'password123',
      tipo: 'CLIENTE_PLATAFORMA' // Enviamos a string para a API
    };

    const response = await request(app)
      .post('/usuario')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.email).toBe(userData.email);
  });

  // Teste 2: Impedir criação com e-mail duplicado
  it('should not be able to create a user with a duplicate email', async () => {
    // 1. Arrange: Criamos um usuário direto no banco para o teste
    await prisma.usuario.create({
      data: {
        nome: 'Julia Duplicado',
        email: 'julia.duplicado@example.com',
        senha: await bcrypt.hash('password123', 8),
        // A CORREÇÃO FINAL ESTÁ AQUI:
        // Usamos o Enum importado porque estamos falando direto com o Prisma
        tipo: TipoUsuario.CLIENTE_PLATAFORMA 
      }
    });
    
    // 2. Act: Agora, tentamos criar o mesmo usuário pela API
    const response = await request(app)
      .post('/usuario')
      .send({
        nome: 'Outra Julia',
        email: 'julia.duplicado@example.com', // Mesmo email
        senha: 'outrasenha',
        tipo: 'CLIENTE_PLATAFORMA'
      });
      
    // 3. Assert: Esperamos que o controller impeça a duplicação
    expect(response.status).toBe(400);
    expect(response.body.error).toEqual('Este e-mail já está em uso.');
  });
});