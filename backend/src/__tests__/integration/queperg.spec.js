// src/__tests__/integration/queperg.spec.js
import request from 'supertest';
import { app } from '../../server.js';
import { prisma } from '../../database/client.js';
import jwt from 'jsonwebtoken';

describe('Rotas de QuePerg (API E2E)', () => {
  let empresa;
  let usuario;
  let pergunta;
  let questionario;
  let quePerg;
  let authToken;

  beforeAll(async () => {
    // limpeza em ordem de FK
    await prisma.resposta.deleteMany();
    await prisma.usuAval.deleteMany();
    await prisma.avaliacao.deleteMany();
    await prisma.quePerg.deleteMany();
    await prisma.opcao.deleteMany().catch(() => {});
    await prisma.pergunta.deleteMany();
    await prisma.questionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.empresa.deleteMany();

    // cria empresa
    empresa = await prisma.empresa.upsert({
      where: { emailResponsavel: 'queperg-test@empresa.com' },
      update: {},
      create: {
        nome: 'Empresa QuePerg Test',
        emailResponsavel: 'queperg-test@empresa.com',
        senhaEmpresa: '123'
      }
    });

    // cria usuário ADMIN
    usuario = await prisma.usuario.create({
      data: {
        nome: 'Admin QuePerg',
        email: 'admin.queperg@teste.com',
        tipo: 'ADMIN_EMPRESA',
        empresaId: empresa.id
      }
    });

    // cria pergunta
    pergunta = await prisma.pergunta.create({
      data: {
        enunciado: 'Pergunta base para QuePerg',
        tipos: 'TEXTO',
        obrigatoria: false
      }
    });

    // cria questionário
    questionario = await prisma.questionario.create({
      data: {
        titulo: 'Questionário base para QuePerg',
        criadorId: usuario.id
      }
    });

    // associa pergunta ao questionário
    quePerg = await prisma.quePerg.create({
      data: {
        questionarioId: questionario.id,
        perguntaId: pergunta.id,
        ordem: 1
      }
    });

    // token
    authToken = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo, empresaId: usuario.empresaId },
      process.env.JWT_SECRET || 'supersecret_test_key',
      { expiresIn: '1d' }
    );
  });

  afterAll(async () => {
    await prisma.resposta.deleteMany();
    await prisma.usuAval.deleteMany();
    await prisma.avaliacao.deleteMany();
    await prisma.quePerg.deleteMany();
    await prisma.opcao.deleteMany();
    await prisma.pergunta.deleteMany();
    await prisma.questionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.empresa.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /api/queperg', () => {
    it('deve retornar lista de quePerg quando autenticado', async () => {
      const res = await request(app)
        .get(`/api/queperg?questionarioId=${questionario.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const found = res.body.find((q) => q.id === quePerg.id);
      expect(found).toBeDefined();
    });

    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get(`/api/queperg?questionarioId=${questionario.id}`);
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/queperg/:id', () => {
    it('deve retornar o quePerg quando autenticado', async () => {
      const res = await request(app)
        .get(`/api/queperg/${quePerg.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(quePerg.id);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const res = await request(app)
        .get('/api/queperg/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 400]).toContain(res.status);
    });
  });

  describe('POST /api/queperg', () => {
    let novoQuePergId;

    it('deve criar um quePerg quando autenticado', async () => {
      const payload = {
        perguntaId: pergunta.id,
        questionarioId: questionario.id
      };

      const res = await request(app)
        .post('/api/queperg')
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      novoQuePergId = res.body.id;

      const qpDb = await prisma.quePerg.findUnique({ where: { id: novoQuePergId } });
      expect(qpDb).toBeDefined();
    });

    it('deve retornar 400 se faltar campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/queperg')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ perguntaId: pergunta.id });

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/queperg/:id', () => {
    it('deve atualizar um quePerg', async () => {
      const res = await request(app)
        .put(`/api/queperg/${quePerg.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          id: quePerg.id,
          pergunta_id: pergunta.id,
          questionario_id: questionario.id
        });

      expect([200, 204]).toContain(res.status);

      const qpDb = await prisma.quePerg.findUnique({ where: { id: quePerg.id } });
      expect(qpDb.perguntaId).toBe(pergunta.id);
      expect(qpDb.questionarioId).toBe(questionario.id);
    });
  });

  describe('DELETE /api/queperg/:id', () => {
    it('deve remover um quePerg', async () => {
      const res = await request(app)
        .delete(`/api/queperg/${quePerg.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 204]).toContain(res.status);

      const qpDb = await prisma.quePerg.findUnique({ where: { id: quePerg.id } });
      expect(qpDb).toBeNull();
    });
  });
});
