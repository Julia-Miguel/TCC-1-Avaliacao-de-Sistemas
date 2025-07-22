import request from 'supertest';
import { app } from '../../server.js';
import { PrismaClient, TipoUsuario } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Rotas de Questionário (/questionarios)', () => {
  let adminToken;
  let admin;
  let questionarioParaTestes;

  beforeAll(async () => {
    await prisma.questionario.deleteMany({});
    await prisma.usuario.deleteMany({});
    await prisma.empresa.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 8);
    const empresa = await prisma.empresa.create({
      data: {
        nome: 'Empresa de Teste de Questionario Final',
        emailResponsavel: 'resp.questionario.final@teste.com',
        senhaEmpresa: hashedPassword,
      },
    });
    admin = await prisma.usuario.create({
      data: {
        nome: 'Admin de Questionario Final',
        email: 'admin.questionario.final@teste.com',
        senha: hashedPassword,
        tipo: TipoUsuario.ADMIN_EMPRESA,
        empresaId: empresa.id,
      },
    });
    const loginResponse = await request(app)
      .post('/usuarios/login-admin')
      .send({ email: admin.email, senha: 'password123', empresaId: empresa.id });
    adminToken = loginResponse.body.token;
  });

  beforeEach(async () => {
    await prisma.questionario.deleteMany({});
    questionarioParaTestes = await prisma.questionario.create({
        data: {
            titulo: "Questionário Padrão para Testes",
            // ✅ CORREÇÃO: A linha 'ativo: true' foi removida.
            criadorId: admin.id 
        }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /questionarios', () => {
      it('deve criar um novo questionário quando autenticado', async () => {
        const response = await request(app)
          .post('/questionarios')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ titulo: 'Novo Questionário de Satisfação' });

        expect(response.status).toBe(201);
        expect(response.body.titulo).toBe('Novo Questionário de Satisfação');
      });
  });

  describe('GET /questionarios/:id', () => {
    it('deve buscar um questionário pelo seu ID', async () => {
        const response = await request(app)
            .get(`/questionarios/${questionarioParaTestes.id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.titulo).toBe(questionarioParaTestes.titulo);
    });
  });

  describe('DELETE /questionarios/:id', () => {
    it('deve deletar um questionário', async () => {
        const response = await request(app)
            .delete(`/questionarios/${questionarioParaTestes.id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Questionário deletado com sucesso');

        const questionarioNoDB = await prisma.questionario.findUnique({
            where: { id: questionarioParaTestes.id }
        });
        expect(questionarioNoDB).toBeNull();
    });
  });
});
