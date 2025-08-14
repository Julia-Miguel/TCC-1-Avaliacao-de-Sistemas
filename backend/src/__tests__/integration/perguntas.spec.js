// src/__tests__/integration/perguntas.spec.js
import request from 'supertest';
import { app } from '../../server.js';
import { prisma } from '../../database/client.js';
import jwt from 'jsonwebtoken';

describe('Rotas de Perguntas (API E2E)', () => {
  let empresa;
  let usuario;
  let pergunta;
  let questionario;
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
      where: { emailResponsavel: 'pergunta-test@empresa.com' },
      update: {},
      create: {
        nome: 'Empresa Pergunta Test',
        emailResponsavel: 'pergunta-test@empresa.com',
        senhaEmpresa: '123'
      }
    });

    // cria usuário ADMIN vinculado à empresa
    usuario = await prisma.usuario.create({
      data: {
        nome: 'Admin Pergunta',
        email: 'admin.pergunta@teste.com',
        tipo: 'ADMIN_EMPRESA',
        empresaId: empresa.id
      }
    });

    // cria pergunta base (usado pelos GETs)
    pergunta = await prisma.pergunta.create({
      data: {
        enunciado: 'Pergunta Teste - GET',
        tipos: 'TEXTO',
        obrigatoria: false
      }
    });

    // cria questionário base para associar a pergunta
    questionario = await prisma.questionario.create({
      data: {
        titulo: 'Questionário para Pergunta Test - GET',
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
    await prisma.opcao.deleteMany();
    await prisma.pergunta.deleteMany();
    await prisma.questionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.empresa.deleteMany();
    await prisma.$disconnect();
  });

  /* ---------- READ: GET list / GET by id ---------- */
  describe('GET /api/perguntas', () => {
    it('deve retornar 200 e uma lista de perguntas quando autenticado', async () => {
      const res = await request(app)
        .get('/api/perguntas')
        .set('Authorization', `Bearer ${authToken}`);

      if (res.status !== 200) {
        // eslint-disable-next-line no-console
        console.log('GET /api/perguntas response:', res.status, res.body || res.text);
      }

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const found = res.body.find((p) => p.id === pergunta.id);
      expect(found).toBeDefined();
    });

    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get('/api/perguntas');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/perguntas/:id', () => {
    it('deve retornar 200 e a pergunta quando autenticado', async () => {
      const res = await request(app)
        .get(`/api/perguntas/${pergunta.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      if (res.status !== 200) {
        // eslint-disable-next-line no-console
        console.log(`GET /api/perguntas/${pergunta.id} response:`, res.status, res.body || res.text);
      }

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(pergunta.id);
    });

    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get(`/api/perguntas/${pergunta.id}`);
      expect(res.status).toBe(401);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const res = await request(app)
        .get('/api/perguntas/9999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  /* ---------- CREATE / UPDATE / DELETE via API (E2E) ---------- */
  describe('CRUD via API - POST / PATCH / DELETE', () => {
    let createdPerguntaId;

    it('POST /api/perguntas deve criar uma pergunta (201/200) e retornar o objeto criado', async () => {
      const payload = {
        enunciado: 'Pergunta Criada via API - Teste',
        tipos: 'TEXTO',
        obrigatoria: true
      };

      const res = await request(app)
        .post('/api/perguntas')
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);

      // debug
      if (![200, 201].includes(res.status)) {
        // eslint-disable-next-line no-console
        console.log('POST /api/perguntas response:', res.status, res.body || res.text);
      }

      expect([200, 201]).toContain(res.status);
      expect(res.body).toBeDefined();
      const createdId = res.body.id ?? res.body?.pergunta?.id;
      expect(createdId).toBeDefined();
      createdPerguntaId = createdId;

      // valida no banco
      const pFromDb = await prisma.pergunta.findUnique({ where: { id: parseInt(createdPerguntaId) } });
      expect(pFromDb).toBeDefined();
      expect(pFromDb.enunciado).toBeTruthy();
    });

    it('PATCH /api/perguntas/:id deve atualizar a pergunta (200) — alterar enunciado', async () => {
      const newEnunciado = 'Pergunta Atualizada via API - Teste';
      const res = await request(app)
        .patch(`/api/perguntas/${createdPerguntaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ enunciado: newEnunciado });

      if (res.status !== 200) {
        // eslint-disable-next-line no-console
        console.log(`PATCH /api/perguntas/${createdPerguntaId} response:`, res.status, res.body || res.text);
      }

      expect([200, 204]).toContain(res.status);

      const pFromDb = await prisma.pergunta.findUnique({ where: { id: parseInt(createdPerguntaId) } });
      expect(pFromDb).toBeDefined();
      expect(pFromDb.enunciado).toBe(newEnunciado);
    });

    it('DELETE /api/perguntas/:id deve remover a pergunta (200/204) e não existir mais no DB', async () => {
      const res = await request(app)
        .delete(`/api/perguntas/${createdPerguntaId}`)
        .set('Authorization', `Bearer ${authToken}`);

      if (![200, 204].includes(res.status)) {
        // eslint-disable-next-line no-console
        console.log(`DELETE /api/perguntas/${createdPerguntaId} response:`, res.status, res.body || res.text);
      }

      expect([200, 204]).toContain(res.status);

      const pFromDb = await prisma.pergunta.findUnique({ where: { id: parseInt(createdPerguntaId) } });
      expect(pFromDb).toBeNull();
    });
  });
});