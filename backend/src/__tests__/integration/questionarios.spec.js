// src/__tests__/integration/questionarios.improved.spec.js
// Exemplo de como usar as funções auxiliares nos testes

import request from 'supertest';
import { app } from '../../server.js';
import { prisma } from '../../database/client.js';
import {
  cleanDatabase,
  createTestCompany,
  createTestQuestionario,
  expectSuccessResponse,
  expectErrorResponse,
  validateRequiredFields,
  validateNoSensitiveFields,
  testCRUDOperations,
  DEFAULT_TEST_DATA
} from '../helpers/testHelpers.js';

describe('Rotas de Questionários (Melhorado com Helpers)', () => {
  let testData;

  beforeAll(async () => {
    await cleanDatabase();
    testData = await createTestCompany('-questionarios');
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
  });

  describe('GET /api/questionarios', () => {
    beforeEach(async () => {
      // Cria questionário para cada teste
      await createTestQuestionario(testData.admin.id);
    });

    it('deve retornar lista de questionários com estrutura correta', async () => {
      const res = await request(app)
        .get('/api/questionarios')
        .set('Authorization', `Bearer ${testData.authToken}`);

      expectSuccessResponse(res);
      expect(Array.isArray(res.body)).toBe(true);

      if (res.body.length > 0) {
        const questionario = res.body[0];
        validateRequiredFields(questionario, ['id', 'titulo', 'criadorId']);
        validateNoSensitiveFields(questionario);
      }
    });

    it('deve retornar erro 401 sem autenticação', async () => {
      const res = await request(app).get('/api/questionarios');
      expectErrorResponse(res, 401);
    });

    it('deve filtrar questionários por empresa do usuário', async () => {
      // Cria outra empresa para verificar isolamento
      const { admin: outroAdmin } = await createTestCompany('-outro');
      await createTestQuestionario(outroAdmin.id);

      const res = await request(app)
        .get('/api/questionarios')
        .set('Authorization', `Bearer ${testData.authToken}`);

      expectSuccessResponse(res);
      
      // Todos os questionários devem ser da empresa do usuário logado
      res.body.forEach(q => {
        expect(q.criadorId).toBe(testData.admin.id);
      });
    });
  });

  describe('GET /api/questionarios/:id', () => {
    let questionarioTeste;

    beforeEach(async () => {
      const result = await createTestQuestionario(testData.admin.id);
      questionarioTeste = result.questionario;
    });

    it('deve retornar questionário completo com perguntas', async () => {
      const res = await request(app)
        .get(`/api/questionarios/${questionarioTeste.id}`)
        .set('Authorization', `Bearer ${testData.authToken}`);

      expectSuccessResponse(res);
      validateRequiredFields(res.body, ['id', 'titulo', 'perguntas']);
      expect(Array.isArray(res.body.perguntas)).toBe(true);
      
      if (res.body.perguntas.length > 0) {
        const pergunta = res.body.perguntas[0];
        validateRequiredFields(pergunta, ['pergunta', 'ordem']);
        validateRequiredFields(pergunta.pergunta, ['id', 'enunciado', 'tipos']);
      }
    });

    it('deve retornar 404 para ID inexistente', async () => {
      const res = await request(app)
        .get('/api/questionarios/999999')
        .set('Authorization', `Bearer ${testData.authToken}`);

      expectErrorResponse(res, 404);
    });

    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app)
        .get(`/api/questionarios/${questionarioTeste.id}`);

      expectErrorResponse(res, 401);
    });
  });

  describe('CRUD Completo via testCRUDOperations', () => {
    it('deve executar operações CRUD completas', async () => {
      const crudTestData = {
        create: {
          titulo: 'Questionário CRUD Teste',
          perguntas: [
            {
              enunciado: 'Pergunta 1 do CRUD',
              tipos: 'TEXTO',
              obrigatoria: true
            },
            {
              enunciado: 'Pergunta 2 do CRUD',
              tipos: 'TEXTO',
              obrigatoria: false
            }
          ]
        },
        update: {
          titulo: 'Questionário CRUD Atualizado'
        }
      };

      const createdId = await testCRUDOperations(
        request(app),
        '/api/questionarios',
        testData.authToken,
        crudTestData
      );

      expect(createdId).toBeDefined();
      expect(typeof createdId).toBe('number');
    });
  });

  describe('Validações de Negócio', () => {
    it('deve rejeitar questionário sem título', async () => {
      const res = await request(app)
        .post('/api/questionarios')
        .set('Authorization', `Bearer ${testData.authToken}`)
        .send({
          perguntas: [DEFAULT_TEST_DATA.pergunta]
        });

      expectErrorResponse(res, 400);
    });

    it('deve aceitar questionário sem perguntas', async () => {
      const res = await request(app)
        .post('/api/questionarios')
        .set('Authorization', `Bearer ${testData.authToken}`)
        .send({
          titulo: 'Questionário Vazio'
        });

      expectSuccessResponse(res, 201);
    });

    it('deve criar perguntas automaticamente quando fornecidas', async () => {
      const perguntasTest = [
        { enunciado: 'Auto pergunta 1', tipos: 'TEXTO', obrigatoria: true },
        { enunciado: 'Auto pergunta 2', tipos: 'TEXTO', obrigatoria: false }
      ];

      const res = await request(app)
        .post('/api/questionarios')
        .set('Authorization', `Bearer ${testData.authToken}`)
        .send({
          titulo: 'Questionário com Auto Perguntas',
          perguntas: perguntasTest
        });

      expectSuccessResponse(res, 201);
      
      // Verifica se as perguntas foram criadas
      const questionarioCompleto = await request(app)
        .get(`/api/questionarios/${res.body.id}`)
        .set('Authorization', `Bearer ${testData.authToken}`);

      expect(questionarioCompleto.body.perguntas).toHaveLength(2);
    });
  });

  describe('Cenários de Erro e Edge Cases', () => {
    it('deve tratar erro de servidor graciosamente', async () => {
      // Força erro interno (apenas para teste)
      jest.spyOn(console, 'error').mockImplementation(() => {}); // silencia logs de erro
      
      const res = await request(app)
        .get('/api/questionarios/invalidid')
        .set('Authorization', `Bearer ${testData.authToken}`);

      expect([400, 404, 500]).toContain(res.status);
      
      jest.restoreAllMocks();
    });

    it('deve lidar com payload muito grande', async () => {
      const perguntasGigantes = Array(100).fill().map((_, i) => ({
        enunciado: `Pergunta ${i} `.repeat(100), // texto muito longo
        tipos: 'TEXTO',
        obrigatoria: false
      }));

      const res = await request(app)
        .post('/api/questionarios')
        .set('Authorization', `Bearer ${testData.authToken}`)
        .send({
          titulo: 'Questionário Gigante',
          perguntas: perguntasGigantes
        });

      // Pode ser aceito ou rejeitado dependendo dos limites configurados
      expect([200, 201, 400, 413]).toContain(res.status);
    });

    it('deve validar tipos de dados corretos', async () => {
      const payloadsInvalidos = [
        { titulo: 123 }, // título deve ser string
        { titulo: null },
        { titulo: '' }, // título vazio
        { titulo: 'Válido', perguntas: 'não é array' },
        { titulo: 'Válido', perguntas: [{ enunciado: 123 }] } // enunciado deve ser string
      ];

      for (const payload of payloadsInvalidos) {
        const res = await request(app)
          .post('/api/questionarios')
          .set('Authorization', `Bearer ${testData.authToken}`)
          .send(payload);

        expect([400, 422]).toContain(res.status);
      }
    });
  });

  describe('Performance e Concorrência', () => {
    it('deve suportar múltiplas requisições simultâneas', async () => {
      const requests = Array(5).fill().map((_, i) =>
        request(app)
          .post('/api/questionarios')
          .set('Authorization', `Bearer ${testData.authToken}`)
          .send({
            titulo: `Questionário Concorrente ${i}`,
            perguntas: [
              { enunciado: `Pergunta ${i}`, tipos: 'TEXTO', obrigatoria: false }
            ]
          })
      );

      const responses = await Promise.all(requests);

      responses.forEach(res => {
        expectSuccessResponse(res, 201);
      });

      // Verifica se todos foram criados
      const listRes = await request(app)
        .get('/api/questionarios')
        .set('Authorization', `Bearer ${testData.authToken}`);

      expect(listRes.body.length).toBeGreaterThanOrEqual(5);
    });

    it('deve retornar resposta em tempo hábil', async () => {
      const start = Date.now();

      const res = await request(app)
        .get('/api/questionarios')
        .set('Authorization', `Bearer ${testData.authToken}`);

      const duration = Date.now() - start;

      expectSuccessResponse(res);
      expect(duration).toBeLessThan(5000); // menos de 5 segundos
    });
  });

  describe('Integração com outras entidades', () => {
    it('deve permitir criar avaliação a partir do questionário', async () => {
      const { questionario } = await createTestQuestionario(testData.admin.id);

      const res = await request(app)
        .post('/api/avaliacao')
        .set('Authorization', `Bearer ${testData.authToken}`)
        .send({
          semestre: '2025.1',
          questionarioId: questionario.id,
          requerLoginCliente: false
        });

      expectSuccessResponse(res, 201);
      expect(res.body.questionarioId).toBe(questionario.id);
    });

    it('deve impedir exclusão de questionário com avaliações ativas', async () => {
      const { questionario } = await createTestQuestionario(testData.admin.id);

      // Cria avaliação vinculada
      await prisma.avaliacao.create({
        data: {
          semestre: '2025.1',
          questionarioId: questionario.id,
          criadorId: testData.admin.id,
          requerLoginCliente: false
        }
      });

      const res = await request(app)
        .delete(`/api/questionarios/${questionario.id}`)
        .set('Authorization', `Bearer ${testData.authToken}`);

      // Deve falhar devido à restrição de FK ou regra de negócio
      expect([400, 409]).toContain(res.status);
    });
  });
});