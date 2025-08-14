// src/__tests__/integration/usuAval.spec.js
import request from 'supertest';
import { app } from '../../server.js';
import { prisma } from '../../database/client.js';
import jwt from 'jsonwebtoken';

describe('Rotas de UsuAval (API E2E)', () => {
  let empresa;
  let usuario;
  let questionario;
  let avaliacao;
  let usuAval;
  let authToken;

  beforeAll(async () => {
    // limpeza em ordem de FK
    await prisma.resposta.deleteMany();
    await prisma.usuAval.deleteMany();
    await prisma.avaliacao.deleteMany();
    await prisma.quePerg.deleteMany();
    await prisma.pergunta.deleteMany();
    await prisma.questionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.empresa.deleteMany();

    // cria empresa
    empresa = await prisma.empresa.upsert({
      where: { emailResponsavel: 'usuaval-test@empresa.com' },
      update: {},
      create: {
        nome: 'Empresa UsuAval Test',
        emailResponsavel: 'usuaval-test@empresa.com',
        senhaEmpresa: '123'
      }
    });

    // cria usuário ADMIN
    usuario = await prisma.usuario.create({
      data: {
        nome: 'Admin UsuAval',
        email: 'admin.usuaval@teste.com',
        tipo: 'ADMIN_EMPRESA',
        empresaId: empresa.id
      }
    });

    // cria questionário
    questionario = await prisma.questionario.create({
      data: {
        titulo: 'Questionário base para UsuAval',
        criadorId: usuario.id
      }
    });

    // cria avaliação
    avaliacao = await prisma.avaliacao.create({
      data: {
        semestre: '2025.1',
        requerLoginCliente: false,
        questionarioId: questionario.id,
        criadorId: usuario.id
      }
    });

    // cria usuAval base para testes GET
    usuAval = await prisma.usuAval.create({
      data: {
        avaliacaoId: avaliacao.id,
        usuarioId: usuario.id,
        status: 'EM_ANDAMENTO',
        isFinalizado: false,
        started_at: new Date()
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
    await prisma.pergunta.deleteMany();
    await prisma.questionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.empresa.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /api/usuAval', () => {
    it('deve retornar lista de usuAval quando autenticado', async () => {
      const res = await request(app)
        .get('/api/usuAval')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const found = res.body.find((ua) => ua.id === usuAval.id);
      expect(found).toBeDefined();
      expect(found.status).toBe('EM_ANDAMENTO');
      expect(found.isFinalizado).toBe(false);
    });

    it('deve retornar 401 sem token', async () => {
      const res = await request(app).get('/api/usuAval');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/usuAval/:id', () => {
    it('deve retornar o usuAval quando autenticado', async () => {
      const res = await request(app)
        .get(`/api/usuAval/${usuAval.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(usuAval.id);
      expect(res.body).toHaveProperty('usuario');
      expect(res.body).toHaveProperty('avaliacao');
      expect(res.body.status).toBe('EM_ANDAMENTO');
    });

    it('deve retornar 404 para id inexistente', async () => {
      const res = await request(app)
        .get('/api/usuAval/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect([404, 400]).toContain(res.status);
    });
  });

  describe('POST /api/usuAval', () => {
    let novoUsuAvalId;

    it('deve criar um usuAval quando payload válido', async () => {
      const payload = {
        usuario_id: usuario.id,
        avaliacao_id: avaliacao.id,
        status: 'INICIADO',
        isFinalizado: false
      };

      const res = await request(app)
        .post('/api/usuAval')
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.id).toBeDefined();
      expect(res.body.status).toBe('INICIADO');
      expect(res.body.isFinalizado).toBe(false);
      novoUsuAvalId = res.body.id;

      // Verifica no banco
      const uaDb = await prisma.usuAval.findUnique({ where: { id: novoUsuAvalId } });
      expect(uaDb).toBeDefined();
      expect(uaDb.status).toBe('INICIADO');
    });

    it('deve retornar erro se faltar campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/usuAval')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ usuario_id: usuario.id }); // faltando avaliacao_id

      expect([400, 500]).toContain(res.status);
    });
  });

  describe('PUT /api/usuAval', () => {
    it('deve atualizar um usuAval existente', async () => {
      const payload = {
        id: usuAval.id,
        usuario_id: usuario.id,
        avaliacao_id: avaliacao.id,
        status: 'FINALIZADO',
        isFinalizado: true
      };

      const res = await request(app)
        .put('/api/usuAval')
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);

      expect([200, 204]).toContain(res.status);

      // Verifica a atualização no banco
      const uaDb = await prisma.usuAval.findUnique({ where: { id: usuAval.id } });
      expect(uaDb.status).toBe('FINALIZADO');
      expect(uaDb.isFinalizado).toBe(true);
    });
  });

  describe('DELETE /api/usuAval', () => {
    it('deve remover um usuAval', async () => {
      // Cria um usuAval temporário para deletar
      const tempUsuAval = await prisma.usuAval.create({
        data: {
          avaliacaoId: avaliacao.id,
          usuarioId: usuario.id,
          status: 'TEMP_DELETE',
          isFinalizado: false
        }
      });

      const res = await request(app)
        .delete('/api/usuAval')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ id: tempUsuAval.id });

      expect([200, 204]).toContain(res.status);

      // Verifica se foi removido do banco
      const uaDb = await prisma.usuAval.findUnique({ where: { id: tempUsuAval.id } });
      expect(uaDb).toBeNull();
    });

    it('deve retornar erro ao tentar deletar usuAval inexistente', async () => {
      const res = await request(app)
        .delete('/api/usuAval')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ id: 999999 });

      expect([400, 404, 500]).toContain(res.status);
    });
  });

  describe('Casos de borda e validações', () => {
    it('deve tratar constraint de chave única (avaliacaoId + usuarioId)', async () => {
      // Tenta criar usuAval duplicado com mesma combinação avaliacaoId + usuarioId
      const payload = {
        usuario_id: usuario.id,
        avaliacao_id: avaliacao.id,
        status: 'DUPLICADO',
        isFinalizado: false
      };

      const res = await request(app)
        .post('/api/usuAval')
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);

      // Como já existe usuAval com essa combinação, deve dar erro
      expect([400, 500]).toContain(res.status);
    });

    it('deve funcionar com anonymousSessionId em vez de usuarioId', async () => {
      // Cria diretamente no banco para testar cenário anônimo
      const anonUsuAval = await prisma.usuAval.create({
        data: {
          avaliacaoId: avaliacao.id,
          anonymousSessionId: 'session-123-test',
          status: 'ANONIMO',
          isFinalizado: false
        }
      });

      const res = await request(app)
        .get(`/api/usuAval/${anonUsuAval.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.anonymousSessionId).toBe('session-123-test');
      expect(res.body.usuarioId).toBeNull();

      // Limpa
      await prisma.usuAval.delete({ where: { id: anonUsuAval.id } });
    });
  });
});