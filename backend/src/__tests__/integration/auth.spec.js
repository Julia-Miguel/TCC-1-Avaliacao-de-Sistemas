import request from 'supertest';
import { app } from '../../server.js';
import { PrismaClient, TipoUsuario } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Rotas de Autenticação', () => {
  const testPassword = 'password123';
  let empresaTest;

  beforeAll(async () => {
    // Limpeza simplificada e segura
    await prisma.quePerg.deleteMany({});
    await prisma.pergunta.deleteMany({});
    await prisma.avaliacao.deleteMany({});
    await prisma.questionario.deleteMany({});
    await prisma.usuario.deleteMany({});
    await prisma.empresa.deleteMany({});

    const hashedPassword = await bcrypt.hash(testPassword, 8);
    
    empresaTest = await prisma.empresa.create({
      data: {
        nome: 'Empresa Auth Finalíssima',
        emailResponsavel: 'responsavel.auth.finalissima@teste.com',
        senhaEmpresa: hashedPassword
      }
    });

    await prisma.usuario.create({
      data: {
          nome: 'Admin Auth Finalíssimo',
          email: 'admin.auth.finalissima@teste.com',
          senha: hashedPassword,
          tipo: TipoUsuario.ADMIN_EMPRESA,
          empresaId: empresaTest.id
        }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /usuarios/login-admin', () => {
    it('deve autenticar um admin de empresa e retornar um token', async () => {
      const response = await request(app)
        .post('/usuarios/login-admin')
        .send({
          email: 'admin.auth.finalissima@teste.com',
          senha: testPassword,
          empresaId: empresaTest.id // ✅ CAMPO ADICIONADO
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });
});
