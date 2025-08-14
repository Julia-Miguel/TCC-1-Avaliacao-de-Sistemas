// src/__tests__/integration/avaliacao.spec.js
import request from 'supertest';
import { app } from '../../server.js';
import { prisma } from '../../database/client.js';
import jwt from 'jsonwebtoken';

describe('Rotas de Avaliação', () => {
  let criador;
  let questionario;
  let authToken;
  let empresa;

  beforeAll(async () => {
    // Limpa as tabelas relevantes para evitar conflitos entre execuções
    await prisma.avaliacao.deleteMany();
    await prisma.questionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.empresa.deleteMany();

    // Upsert da empresa — evita Unique constraint em execuções repetidas
    empresa = await prisma.empresa.upsert({
      where: { emailResponsavel: 'avaliacao-test@empresa.com' },
      update: {},
      create: {
        nome: 'Empresa Para Avaliacao Test',
        emailResponsavel: 'avaliacao-test@empresa.com',
        senhaEmpresa: '123'
      }
    });

    // Cria o usuário (criador) vinculado à empresa criada
    criador = await prisma.usuario.create({
      data: {
        email: 'criador.avaliacao@teste.com',
        tipo: 'ADMIN_EMPRESA',
        empresaId: empresa.id
      },
    });

    // Cria questionário vinculado ao criador
    questionario = await prisma.questionario.create({
      data: {
        titulo: 'Questionário para Avaliação de Teste',
        criadorId: criador.id,
      },
    });

    // Gera token com os campos que o middleware espera
    authToken = jwt.sign(
      { id: criador.id, tipo: criador.tipo, empresaId: criador.empresaId },
      process.env.JWT_SECRET || 'supersecret_test_key',
      { expiresIn: '1d' }
    );
  });

  describe('POST /api/avaliacao', () => {
    it('deve ser capaz de criar uma nova avaliação quando autenticado', async () => {
      const dadosAvaliacao = {
        semestre: '2025.1',
        requerLoginCliente: false,
        questionarioId: questionario.id,
        // não precisa enviar criadorId — ideal é o controller pegar do token
        // criadorId: criador.id
      };

      const response = await request(app)
        .post('/api/avaliacao')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dadosAvaliacao);

      // debug extra se falhar
      if (response.status !== 201) {
        // melhora a visibilidade do erro no CI / console
        // eslint-disable-next-line no-console
        console.log('Resposta ao tentar criar avaliação:', response.status, response.body || response.text);
      }

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('não deve ser capaz de criar uma avaliação sem um token', async () => {
      const dadosAvaliacao = {
        semestre: '2025.1',
        requerLoginCliente: false,
        questionarioId: questionario.id,
      };

      const response = await request(app)
        .post('/api/avaliacao')
        .send(dadosAvaliacao);

      expect(response.status).toBe(401);
    });
  });
});
