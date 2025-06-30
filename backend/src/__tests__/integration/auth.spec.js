import request from 'supertest';
import { app } from '../../server.js';
import { PrismaClient, TipoUsuario } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Authentication Routes', () => {
  const testPassword = 'password123';
  let hashedPassword;
  let empresaId; // ID real da empresa criada em cada teste

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash(testPassword, 8);
  });

  beforeEach(async () => {
    // Limpeza completa do banco
    await prisma.resposta.deleteMany();
    await prisma.usuAval.deleteMany();
    await prisma.quePerg.deleteMany();
    await prisma.avaliacao.deleteMany();
    await prisma.pergunta.deleteMany();
    await prisma.questionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.empresa.deleteMany();

    // Criação da empresa
    const empresa = await prisma.empresa.create({
      data: {
        nome: 'Empresa Teste',
        emailResponsavel: 'responsavel@teste.com',
        senhaEmpresa: hashedPassword
      }
    });
    empresaId = empresa.id;

    // Criação dos usuários
    await prisma.usuario.createMany({
      data: [
        {
          nome: 'Cliente Teste',
          email: 'cliente@teste.com',
          senha: hashedPassword,
          tipo: TipoUsuario.CLIENTE_PLATAFORMA,
        },
        {
          nome: 'Admin Teste',
          email: 'admin@teste.com',
          senha: hashedPassword,
          tipo: TipoUsuario.ADMIN_EMPRESA,
          empresaId: empresaId
        }
      ]
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // --- Testes de Login do Cliente da Plataforma ---
  describe('POST /clientes/login', () => {
    it('should be able to authenticate a platform client and return a token', async () => {
      const response = await request(app)
        .post('/clientes/login')
        .send({
          email: 'cliente@teste.com',
          senha: testPassword
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.cliente.email).toBe('cliente@teste.com');
    });

    it('should not be able to authenticate with wrong password for client', async () => {
      const response = await request(app)
        .post('/clientes/login')
        .send({
          email: 'cliente@teste.com',
          senha: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Credenciais de cliente inválidas');

    });
  });

  // --- Testes de Login do Admin da Empresa ---
  describe('POST /admin/login', () => {
    it('should be able to authenticate a company admin and return a token', async () => {
      const response = await request(app)
        .post('/admin/login')
        .send({
          email: 'admin@teste.com',
          senha: testPassword,
          empresaId: empresaId // agora dinâmico!
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.admin.email).toBe('admin@teste.com');
    });

    it('should not be able to authenticate with a non-existent email', async () => {
      const response = await request(app)
        .post('/admin/login')
        .send({
          email: 'naoexiste@teste.com',
          senha: testPassword,
          empresaId: empresaId
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Credenciais de administrador inválidas ou usuário não é admin desta empresa.');
    });
  });

  // --- Testes de Rota Protegida ---
  describe('GET /avaliacao (Protected Route)', () => {
    it('should not be able to access a protected route without a token', async () => {
      const response = await request(app)
        .get('/avaliacao') // agora bate com a rota certa!
        .send();

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token não fornecido.');
    });

    it('should be able to access a protected route with a valid token', async () => {
      const loginResponse = await request(app)
        .post('/admin/login')
        .send({
          email: 'admin@teste.com',
          senha: testPassword,
          empresaId: empresaId
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get('/avaliacao')
        .set('Authorization', `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
    });
  });
});
