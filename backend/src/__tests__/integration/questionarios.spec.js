// src/__tests__/integration/questionarios.spec.js
import request from 'supertest';
import { app } from '../../server.js';
import { prisma } from '../../database/client.js';
import jwt from 'jsonwebtoken';

describe('Rotas de Questionários (API E2E)', () => {
  let empresa;
  let usuario;
  let questionario;
  let pergunta;
  let authToken;

  beforeAll(async () => {
    // limpeza (ordem importante por FK)
    await prisma.resposta.deleteMany();
    await prisma.usuAval.deleteMany();
    await prisma.avaliacao.deleteMany();
    await prisma.quePerg.deleteMany();
    await prisma.opcao.deleteMany().catch(() => {});
    await prisma.pergunta.deleteMany();
    await prisma.questionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.empresa.deleteMany();

    // cria/upsert empresa
    empresa = await prisma.empresa.upsert({
      where: { emailResponsavel: 'questionario-test@empresa.com' },
      update: {},
      create: {
        nome: 'Empresa Questionario Test',
        emailResponsavel: 'questionario-test@empresa.com',
        senhaEmpresa: '123'
      }
    });

    // cria usuário ADMIN vinculado à empresa
    usuario = await prisma.usuario.create({
      data: {
        nome: 'Admin Questionario',
        email: 'admin.questionario@teste.com',
        tipo: 'ADMIN_EMPRESA',
        empresaId: empresa.id
      }
    });

    // cria pergunta existente (usado em alguns asserts)
    pergunta = await prisma.pergunta.create({
      data: {
        enunciado: 'Qual a sua opinião?',
        tipos: 'TEXTO',
        obrigatoria: false
      }
    });

    // cria questionário base (usado pelos GETs)
    questionario = await prisma.questionario.create({
      data: {
        titulo: 'Questionário Teste - GET',
        criadorId: usuario.id
      }
    });

    // associa pergunta ao questionário (que_perg)
    await prisma.quePerg.create({
      data: {
        questionarioId: questionario.id,
        perguntaId: pergunta.id,
        ordem: 1
      }
    });

    // gera token compatível com authMiddleware
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
    await prisma.pergunta.deleteMany();
    await prisma.questionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.empresa.deleteMany();
    await prisma.$disconnect();
  });

  /* ---------- READ: GET list / GET by id ---------- */
  describe('GET /api/questionarios', () => {
    it('deve retornar 200 e uma lista de questionários quando autenticado', async () => {
      const res = await request(app)
        .get('/api/questionarios')
        .set('Authorization', `Bearer ${authToken}`);

      if (res.status !== 200) {
        // eslint-disable-next-line no-console
        console.log('GET /api/questionarios response:', res.status, res.body || res.text);
      }

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const found = res.body.find((q) => q.id === questionario.id);
      expect(found).toBeDefined();
    });

    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get('/api/questionarios');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/questionarios/:id', () => {
    it('deve retornar 200 e o questionário quando autenticado', async () => {
      const res = await request(app)
        .get(`/api/questionarios/${questionario.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      if (res.status !== 200) {
        // eslint-disable-next-line no-console
        console.log(`GET /api/questionarios/${questionario.id} response:`, res.status, res.body || res.text);
      }

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(questionario.id);
      expect(res.body.perguntas).toBeDefined();
      expect(Array.isArray(res.body.perguntas)).toBe(true);
      const linked = res.body.perguntas.find((qp) => qp.pergunta?.id === pergunta.id);
      expect(linked).toBeDefined();
    });

    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get(`/api/questionarios/${questionario.id}`);
      expect(res.status).toBe(401);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const res = await request(app)
        .get('/api/questionarios/9999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 400]).toContain(res.status);
    });
  });

  /* ---------- CREATE / UPDATE / DELETE via API (E2E) ---------- */
  describe('CRUD via API - POST / PATCH / DELETE', () => {
    let createdQuestionarioId;

    it('POST /api/questionarios deve criar um questionário (201/200) e retornar o objeto criado', async () => {
      const payload = {
        titulo: 'Questionário Criado via API - Teste',
        perguntas: [
          { enunciado: 'Como avalia nosso suporte?', tipos: 'TEXTO', obrigatoria: true },
          { enunciado: 'Avalie a clareza das informações', tipos: 'TEXTO', obrigatoria: false }
        ]
      };

      const res = await request(app)
        .post('/api/questionarios')
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);

      // debug
      if (![200, 201].includes(res.status)) {
        // eslint-disable-next-line no-console
        console.log('POST /api/questionarios response:', res.status, res.body || res.text);
      }

      expect([200, 201]).toContain(res.status);
      // assume que o body contém o questionário criado
      expect(res.body).toBeDefined();
      // pode ser que o controller retorne o objeto inteiro ou somente { id }
      const createdId = res.body.id ?? res.body?.questionario?.id;
      expect(createdId).toBeDefined();
      createdQuestionarioId = createdId;

      // valida no banco
      const qFromDb = await prisma.questionario.findUnique({ where: { id: parseInt(createdQuestionarioId) } });
      expect(qFromDb).toBeDefined();
      expect(qFromDb.titulo).toBeTruthy();
    });

    it('PATCH /api/questionarios/:id deve atualizar o questionário (200) — alterar título', async () => {
      const newTitle = 'Questionário Atualizado via API - Teste';
      const res = await request(app)
        .patch(`/api/questionarios/${createdQuestionarioId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ titulo: newTitle });

      if (res.status !== 200) {
        // eslint-disable-next-line no-console
        console.log(`PATCH /api/questionarios/${createdQuestionarioId} response:`, res.status, res.body || res.text);
      }

      // aceitar 200 ou 204 — se 204, faremos fetch do DB para verificar
      expect([200, 204]).toContain(res.status);

      const qFromDb = await prisma.questionario.findUnique({ where: { id: parseInt(createdQuestionarioId) } });
      expect(qFromDb).toBeDefined();
      expect(qFromDb.titulo).toBe(newTitle);
    });

    it('DELETE /api/questionarios/:id deve remover o questionário (200/204) e não existir mais no DB', async () => {
      const res = await request(app)
        .delete(`/api/questionarios/${createdQuestionarioId}`)
        .set('Authorization', `Bearer ${authToken}`);

      if (![200, 204].includes(res.status)) {
        // eslint-disable-next-line no-console
        console.log(`DELETE /api/questionarios/${createdQuestionarioId} response:`, res.status, res.body || res.text);
      }

      expect([200, 204]).toContain(res.status);

      const qFromDb = await prisma.questionario.findUnique({ where: { id: parseInt(createdQuestionarioId) } });
      expect(qFromDb).toBeNull();
    });
  });
});
