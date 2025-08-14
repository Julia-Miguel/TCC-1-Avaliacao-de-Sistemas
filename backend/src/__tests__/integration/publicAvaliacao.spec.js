// backend/src/__tests__/integration/publicAvaliacao.spec.js
import request from 'supertest';
import { app } from '../../server.js';
import { prisma } from '../../database/client.js';

describe('Rotas Públicas de Avaliação (API E2E)', () => {
  let empresa, criador, questionario, avaliacao, perguntaObrigatoria;

  beforeAll(async () => {
    empresa = await prisma.empresa.upsert({
      where: { emailResponsavel: 'public-test@empresa.com' },
      update: {},
      create: {
        nome: 'Empresa Teste Publico',
        emailResponsavel: 'public-test@empresa.com',
        senhaEmpresa: '123'
      }
    });

    criador = await prisma.usuario.upsert({
      where: { email: 'criador.publico@teste.com' },
      update: {},
      create: {
        email: 'criador.publico@teste.com',
        tipo: 'ADMIN_EMPRESA',
        empresaId: empresa.id
      }
    });

    questionario = await prisma.questionario.create({
      data: {
        titulo: 'Questionário Público Teste',
        criadorId: criador.id,
      }
    });

    perguntaObrigatoria = await prisma.pergunta.create({
      data: {
        enunciado: 'Pergunta de texto obrigatória',
        tipos: 'TEXTO',
        obrigatoria: true,
        questionarios: {
          create: [{ questionarioId: questionario.id }]
        }
      }
    });
  });

  beforeEach(async () => {
    await prisma.resposta.deleteMany();
    await prisma.usuAval.deleteMany();
    await prisma.avaliacao.deleteMany();

    avaliacao = await prisma.avaliacao.create({
      data: {
        semestre: '2025.1',
        requerLoginCliente: false,
        questionarioId: questionario.id,
        criadorId: criador.id
      }
    });

    await prisma.avaliacao.create({
      data: {
        semestre: '2025.2',
        requerLoginCliente: true,
        questionarioId: questionario.id,
        criadorId: criador.id
      }
    });
  });

  describe('GET /api/public/avaliacoes/:token/check', () => {
    it('deve retornar informações básicas da avaliação', async () => {
      const res = await request(app).get(`/api/public/avaliacoes/${avaliacao.token}/check`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('requerLoginCliente', false);
      expect(res.body.questionario).toHaveProperty('eh_satisfacao');
    });
  });

  describe('GET /api/public/avaliacoes/:token', () => {
    it('deve retornar dados completos da avaliação pública', async () => {
      const res = await request(app).get(`/api/public/avaliacoes/${avaliacao.token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', avaliacao.id);
      expect(res.body).toHaveProperty('questionario');
    });

    it('deve retornar 404 para token de avaliação inexistente', async () => {
      const tokenInvalido = '00000000-0000-0000-0000-000000000000';
      const res = await request(app).get(`/api/public/avaliacoes/${tokenInvalido}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/public/avaliacoes/:token/iniciar', () => {
    it('deve iniciar avaliação anônima e retornar UsuAval', async () => {
      const res = await request(app)
        .post(`/api/public/avaliacoes/${avaliacao.token}/iniciar`)
        .send({ anonymousSessionId: 'session-anonima-123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('usuAval');
      expect(res.body.usuAval.anonymousSessionId).toBe('session-anonima-123');
    });
  });

  describe('POST /api/public/avaliacoes/:token/respostas', () => {
    it('deve submeter respostas válidas', async () => {
      const usuAval = await prisma.usuAval.create({
        data: {
          avaliacaoId: avaliacao.id,
          anonymousSessionId: 'session-para-resposta',
          status: 'EM_ANDAMENTO'
        }
      });

      const res = await request(app)
        .post(`/api/public/avaliacoes/${avaliacao.token}/respostas`)
        .send({
          usuAvalId: usuAval.id,
          respostas: [{ perguntaId: perguntaObrigatoria.id, resposta: 'Minha resposta' }]
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Respostas salvas com sucesso');
    });
  });
});