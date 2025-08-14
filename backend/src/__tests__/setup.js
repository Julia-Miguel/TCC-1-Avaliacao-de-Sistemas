// src/__tests__/setup.js
// Arquivo de configuração global para os testes

import { prisma } from '../database/client.js';

// Configuração global antes de todos os testes
beforeAll(async () => {
  // Aumenta o timeout para operações de banco de dados
  jest.setTimeout(30000);
});

// Limpeza global após todos os testes
afterAll(async () => {
  await prisma.$disconnect();
});

// src/__tests__/helpers/testHelpers.js
// Funções auxiliares para os testes

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../../database/client.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_test_key';

/**
 * Limpa todas as tabelas em ordem correta (respeitando FKs)
 */
export async function cleanDatabase() {
  await prisma.resposta.deleteMany();
  await prisma.usuAval.deleteMany();
  await prisma.avaliacao.deleteMany();
  await prisma.quePerg.deleteMany();
  await prisma.opcao.deleteMany().catch(() => {});
  await prisma.pergunta.deleteMany();
  await prisma.questionario.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.empresa.deleteMany();
}

/**
 * Cria uma empresa de teste completa com admin
 */
export async function createTestCompany(suffix = '') {
  const empresa = await prisma.empresa.create({
    data: {
      nome: `Empresa Test${suffix}`,
      emailResponsavel: `test${suffix}@empresa.com`,
      senhaEmpresa: await bcrypt.hash('senha123', 10)
    }
  });

  const admin = await prisma.usuario.create({
    data: {
      nome: `Admin Test${suffix}`,
      email: `admin${suffix}@teste.com`,
      senha: await bcrypt.hash('senha123', 10),
      tipo: 'ADMIN_EMPRESA',
      empresaId: empresa.id
    }
  });

  const authToken = generateToken({
    id: admin.id,
    usuarioId: admin.id,
    tipo: admin.tipo,
    empresaId: admin.empresaId
  });

  return { empresa, admin, authToken };
}

/**
 * Cria questionário de teste com perguntas
 */
export async function createTestQuestionario(criadorId, withPerguntas = true) {
  const questionario = await prisma.questionario.create({
    data: {
      titulo: 'Questionário Teste',
      criadorId: parseInt(criadorId)
    }
  });

  const perguntas = [];

  if (withPerguntas) {
    const perguntaTexto = await prisma.pergunta.create({
      data: {
        enunciado: 'Pergunta de texto obrigatória',
        tipos: 'TEXTO',
        obrigatoria: true
      }
    });

    const perguntaOpcional = await prisma.pergunta.create({
      data: {
        enunciado: 'Pergunta opcional',
        tipos: 'TEXTO',
        obrigatoria: false
      }
    });

    // Associa perguntas ao questionário
    await prisma.quePerg.createMany({
      data: [
        {
          questionarioId: questionario.id,
          perguntaId: perguntaTexto.id,
          ordem: 1
        },
        {
          questionarioId: questionario.id,
          perguntaId: perguntaOpcional.id,
          ordem: 2
        }
      ]
    });

    perguntas.push(perguntaTexto, perguntaOpcional);
  }

  return { questionario, perguntas };
}

/**
 * Cria avaliação de teste
 */
export async function createTestAvaliacao(questionarioId, criadorId, requerLogin = false) {
  return await prisma.avaliacao.create({
    data: {
      semestre: '2025.1',
      requerLoginCliente: requerLogin,
      questionarioId: parseInt(questionarioId),
      criadorId: parseInt(criadorId)
    }
  });
}

/**
 * Gera token JWT para testes
 */
export function generateToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Gera token expirado para testes
 */
export function generateExpiredToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '-1h' });
}

/**
 * Gera token com secret inválido
 */
export function generateInvalidToken(payload) {
  return jwt.sign(payload, 'secret_invalido', { expiresIn: '1h' });
}

/**
 * Cria usuário cliente de avaliação
 */
export async function createTestClienteAvaliacao() {
  return await prisma.usuario.create({
    data: {
      nome: 'Cliente Teste',
      email: 'cliente.teste@email.com',
      tipo: 'CLIENTE_AVALIACAO'
    }
  });
}

/**
 * Cria UsuAval para testes
 */
export async function createTestUsuAval(avaliacaoId, usuarioId = null, anonymousSessionId = null) {
  const data = {
    avaliacaoId: parseInt(avaliacaoId),
    status: 'EM_ANDAMENTO',
    isFinalizado: false,
    started_at: new Date()
  };

  if (usuarioId) {
    data.usuarioId = parseInt(usuarioId);
  } else if (anonymousSessionId) {
    data.anonymousSessionId = anonymousSessionId;
  }

  return await prisma.usuAval.create({ data });
}

/**
 * Valida estrutura de resposta padrão de erro
 */
export function expectErrorResponse(response, statusCode) {
  expect(response.status).toBe(statusCode);
  expect(response.body).toHaveProperty('message');
  expect(typeof response.body.message).toBe('string');
  expect(response.headers['content-type']).toMatch(/json/);
}

/**
 * Valida estrutura de resposta padrão de sucesso
 */
export function expectSuccessResponse(response, statusCode = 200) {
  expect([200, 201, 204]).toContain(response.status);
  if (statusCode !== 204) {
    expect(response.body).toBeDefined();
    expect(response.headers['content-type']).toMatch(/json/);
  }
}

/**
 * Simula delay para testes de timeout
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Gera email único para testes
 */
export function generateUniqueEmail(prefix = 'test') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${prefix}-${timestamp}-${random}@teste.com`;
}

/**
 * Gera session ID único para testes anônimos
 */
export function generateUniqueSessionId(prefix = 'session') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Valida se objeto contém campos obrigatórios
 */
export function validateRequiredFields(obj, requiredFields) {
  requiredFields.forEach(field => {
    expect(obj).toHaveProperty(field);
    expect(obj[field]).toBeDefined();
  });
}

/**
 * Valida se objeto NÃO contém campos sensíveis
 */
export function validateNoSensitiveFields(obj, sensitiveFields = ['senha', 'senhaEmpresa', 'password']) {
  sensitiveFields.forEach(field => {
    expect(obj).not.toHaveProperty(field);
  });
}

/**
 * Cria dados de teste padrão para uma empresa completa
 */
export async function seedTestData() {
  const { empresa, admin, authToken } = await createTestCompany('-seed');
  const { questionario, perguntas } = await createTestQuestionario(admin.id);
  const avaliacao = await createTestAvaliacao(questionario.id, admin.id);
  const cliente = await createTestClienteAvaliacao();
  
  return {
    empresa,
    admin,
    authToken,
    questionario,
    perguntas,
    avaliacao,
    cliente
  };
}

/**
 * Executa teste de CRUD completo para uma entidade
 */
export async function testCRUDOperations(request, basePath, authToken, testData) {
  // CREATE
  const createRes = await request
    .post(basePath)
    .set('Authorization', `Bearer ${authToken}`)
    .send(testData.create);
  
  expectSuccessResponse(createRes, 201);
  const createdId = createRes.body.id;

  // READ (GET by ID)
  const getRes = await request
    .get(`${basePath}/${createdId}`)
    .set('Authorization', `Bearer ${authToken}`);
  
  expectSuccessResponse(getRes);

  // UPDATE
  if (testData.update) {
    const updateRes = await request
      .patch(`${basePath}/${createdId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(testData.update);
    
    expectSuccessResponse(updateRes);
  }

  // DELETE
  const deleteRes = await request
    .delete(`${basePath}/${createdId}`)
    .set('Authorization', `Bearer ${authToken}`);
  
  expectSuccessResponse(deleteRes);

  // Verify deletion
  const verifyRes = await request
    .get(`${basePath}/${createdId}`)
    .set('Authorization', `Bearer ${authToken}`);
  
  expect([404, 400]).toContain(verifyRes.status);

  return createdId;
}

/**
 * Testa autorização para diferentes tipos de usuário
 */
export async function testAuthorizationLevels(request, endpoint, tokens) {
  for (const [userType, token] of Object.entries(tokens)) {
    const res = await request
      .get(endpoint)
      .set('Authorization', `Bearer ${token}`);

    // Documenta qual tipo de usuário está sendo testado
    if (res.status !== 200) {
      console.log(`${userType} - Status: ${res.status} para ${endpoint}`);
    }
  }
}

// src/__tests__/integration/testRunner.js
// Script para executar todos os testes de integração

export const TEST_SUITES = [
  'avaliacao.spec.js',
  'dashboard.spec.js', 
  'empresa.spec.js',
  'perguntas.spec.js',
  'queperg.spec.js',
  'questionarios.spec.js',
  'usuAval.spec.js',
  'publicAvaliacao.spec.js',
  'authMiddleware.spec.js'
];

/**
 * Configuração padrão para todos os testes
 */
export const TEST_CONFIG = {
  timeout: 30000,
  verbose: true,
  detectOpenHandles: true,
  forceExit: true
};

/**
 * Dados de teste padrão
 */
export const DEFAULT_TEST_DATA = {
  empresa: {
    nome: 'Empresa Padrão Teste',
    emailResponsavel: 'padrao@teste.com',
    senhaEmpresa: 'senha123456'
  },
  usuario: {
    nome: 'Usuário Padrão',
    email: 'usuario@teste.com',
    senha: 'senha123456',
    tipo: 'ADMIN_EMPRESA'
  },
  pergunta: {
    enunciado: 'Pergunta padrão de teste',
    tipos: 'TEXTO',
    obrigatoria: false
  },
  questionario: {
    titulo: 'Questionário Padrão de Teste'
  },
  avaliacao: {
    semestre: '2025.1',
    requerLoginCliente: false
  }
};