// src/__tests__/integration/dashboard.spec.js
import request from 'supertest';
import { app } from '../../server.js';
import { prisma } from '../../database/client.js';
import jwt from 'jsonwebtoken';

describe('Rotas de Dashboard', () => {
  let empresa;
  let usuario;
  let questionario;
  let pergunta;
  let avaliacao;
  let usuAval;
  let authToken;

  beforeAll(async () => {
    // limpa as tabelas (ordem importa por causa de FK)
    await prisma.resposta.deleteMany();
    await prisma.usuAval.deleteMany();
    await prisma.avaliacao.deleteMany();
    await prisma.quePerg.deleteMany();
    await prisma.pergunta.deleteMany();
    await prisma.questionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.empresa.deleteMany();

    // cria / upsert da empresa (evita Unique constraint em execuções repetidas)
    empresa = await prisma.empresa.upsert({
      where: { emailResponsavel: 'dashboard-test@empresa.com' },
      update: {},
      create: {
        nome: 'Empresa Dashboard Test',
        emailResponsavel: 'dashboard-test@empresa.com',
        senhaEmpresa: '123'
      }
    });

    // cria usuario admin da empresa
    usuario = await prisma.usuario.create({
      data: {
        nome: 'Admin Dashboard',
        email: 'admin.dashboard@teste.com',
        tipo: 'ADMIN_EMPRESA',
        empresaId: empresa.id
      }
    });

    // cria um questionario, uma pergunta e a associação (QuePerg)
    questionario = await prisma.questionario.create({
      data: {
        titulo: 'Questionário Dashboard Test',
        criadorId: usuario.id
      }
    });

    pergunta = await prisma.pergunta.create({
      data: {
        enunciado: 'Comentário livre sobre o atendimento',
        tipos: 'TEXTO',
        obrigatoria: false
      }
    });

    await prisma.quePerg.create({
      data: {
        questionarioId: questionario.id,
        perguntaId: pergunta.id,
        ordem: 1
      }
    });

    // cria avaliacao vinculada ao questionario e ao criador
    avaliacao = await prisma.avaliacao.create({
      data: {
        semestre: '2025.1',
        requerLoginCliente: false,
        questionarioId: questionario.id,
        criadorId: usuario.id
      }
    });

    // cria usuAval + resposta para que haja dados reais para o dashboard
    usuAval = await prisma.usuAval.create({
      data: {
        avaliacaoId: avaliacao.id,
        usuarioId: usuario.id,
        status: 'FINALIZADO',
        isFinalizado: true,
        started_at: new Date(),
        finished_at: new Date()
      }
    });

    await prisma.resposta.create({
      data: {
        usuAvalId: usuAval.id,
        perguntaId: pergunta.id,
        resposta: 'Ótimo atendimento, muito atenciosos'
      }
    });

    // gera token compatível com o authMiddleware (id, tipo, empresaId)
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

  describe('GET /api/dashboard', () => {
    it('deve retornar 200 e um objeto com dados do dashboard quando autenticado', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      if (res.status !== 200) {
        // debug útil quando o CI falhar
        // eslint-disable-next-line no-console
        console.log('GET /api/dashboard response:', res.status, res.body || res.text);
      }

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(typeof res.body).toBe('object');
    });

    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get('/api/dashboard');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/analise-texto', () => {
    it('deve retornar 200 e algum resultado de análise quando autenticado', async () => {
      const res = await request(app)
        .get('/api/analise-texto')
        .set('Authorization', `Bearer ${authToken}`);

      if (res.status !== 200) {
        // eslint-disable-next-line no-console
        console.log('GET /api/analise-texto response:', res.status, res.body || res.text);
      }

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(typeof res.body).toBe('object');
    });

    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get('/api/analise-texto');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/tempo-estimado', () => {
    it('deve retornar 200 e dados de tempo estimado quando autenticado', async () => {
      const res = await request(app)
        .get('/api/tempo-estimado')
        .set('Authorization', `Bearer ${authToken}`);

      if (res.status !== 200) {
        // eslint-disable-next-line no-console
        console.log('GET /api/tempo-estimado response:', res.status, res.body || res.text);
      }

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(typeof res.body).toBe('object');
    });

    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get('/api/tempo-estimado');
      expect(res.status).toBe(401);
    });
  });
});
