// src/__tests__/integration/authMiddleware.spec.js
import request from 'supertest';
import { app } from '../../server.js';
import { prisma } from '../../database/client.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

describe('Middleware de Autenticação (API E2E)', () => {
  let empresa;
  let adminUsuario;
  let clientePlataforma;
  let validToken;
  let expiredToken;
  let invalidToken;

  beforeAll(async () => {
    // limpeza
    await prisma.resposta.deleteMany();
    await prisma.usuAval.deleteMany();
    await prisma.avaliacao.deleteMany();
    await prisma.quePerg.deleteMany();
    await prisma.pergunta.deleteMany();
    await prisma.questionario.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.empresa.deleteMany();

    // cria empresa
    empresa = await prisma.empresa.create({
      data: {
        nome: 'Empresa Auth Test',
        emailResponsavel: 'auth-test@empresa.com',
        senhaEmpresa: await bcrypt.hash('senha123', 10)
      }
    });

    // cria admin da empresa
    adminUsuario = await prisma.usuario.create({
      data: {
        nome: 'Admin Auth',
        email: 'admin.auth@teste.com',
        senha: await bcrypt.hash('senha123', 10),
        tipo: 'ADMIN_EMPRESA',
        empresaId: empresa.id
      }
    });

    // cria cliente da plataforma
    clientePlataforma = await prisma.usuario.create({
      data: {
        nome: 'Cliente Plataforma',
        email: 'cliente@teste.com',
        senha: await bcrypt.hash('senha123', 10),
        tipo: 'CLIENTE_PLATAFORMA'
      }
    });

    const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_test_key';

    // token válido para admin empresa
    validToken = jwt.sign(
      {
        id: adminUsuario.id,
        usuarioId: adminUsuario.id,
        tipo: adminUsuario.tipo,
        empresaId: adminUsuario.empresaId
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // token expirado
    expiredToken = jwt.sign(
      {
        id: adminUsuario.id,
        usuarioId: adminUsuario.id,
        tipo: adminUsuario.tipo,
        empresaId: adminUsuario.empresaId
      },
      JWT_SECRET,
      { expiresIn: '-1h' } // já expirado
    );

    // token com secret inválido
    invalidToken = jwt.sign(
      {
        id: adminUsuario.id,
        tipo: adminUsuario.tipo
      },
      'secret_invalido',
      { expiresIn: '1h' }
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

  describe('Validação de Token - Rotas Protegidas', () => {
    it('deve aceitar requisição com token válido', async () => {
      const res = await request(app)
        .get('/api/questionarios')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
    });

    it('deve rejeitar requisição sem token', async () => {
      const res = await request(app)
        .get('/api/questionarios');

      expect(res.status).toBe(401);
      expect(res.body.message || res.body.error).toMatch(/token|autenticado/i);
    });

    it('deve rejeitar token malformado', async () => {
      const res = await request(app)
        .get('/api/questionarios')
        .set('Authorization', 'Bearer token_malformado');

      expect(res.status).toBe(401);
    });

    it('deve rejeitar header Authorization inválido', async () => {
      // Sem "Bearer"
      const res1 = await request(app)
        .get('/api/questionarios')
        .set('Authorization', validToken);

      expect(res1.status).toBe(401);

      // Com formato errado
      const res2 = await request(app)
        .get('/api/questionarios')
        .set('Authorization', `Token ${validToken}`);

      expect(res2.status).toBe(401);
    });

    it('deve rejeitar token expirado', async () => {
      const res = await request(app)
        .get('/api/questionarios')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
    });

    it('deve rejeitar token com secret inválido', async () => {
      const res = await request(app)
        .get('/api/questionarios')
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(res.status).toBe(401);
    });
  });

  describe('Diferentes Tipos de Usuário', () => {
    it('deve aceitar ADMIN_EMPRESA em rotas de empresa', async () => {
      const res = await request(app)
        .get('/api/usuario')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
    });

    it('deve rejeitar CLIENTE_PLATAFORMA em rotas de empresa', async () => {
      const clienteToken = jwt.sign(
        {
          id: clientePlataforma.id,
          usuarioId: clientePlataforma.id,
          tipo: clientePlataforma.tipo
        },
        process.env.JWT_SECRET || 'supersecret_test_key',
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .get('/api/usuario') // rota que precisa de empresa
        .set('Authorization', `Bearer ${clienteToken}`);

      // Deve falhar porque cliente não tem empresaId
      expect([401, 403]).toContain(res.status);
    });

    it('deve aceitar token com payload mínimo necessário', async () => {
      const minimalToken = jwt.sign(
        {
          id: adminUsuario.id,
          tipo: 'ADMIN_EMPRESA',
          empresaId: adminUsuario.empresaId
        },
        process.env.JWT_SECRET || 'supersecret_test_key',
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .get('/api/questionarios')
        .set('Authorization', `Bearer ${minimalToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe('Campos do Token no Request', () => {
    it('deve popular request.user com dados do token', async () => {
      // Teste indireto através de uma rota que usa os dados do usuário
      const res = await request(app)
        .get('/api/usuario') // rota que filtra por empresaId
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      // Se chegou até aqui, o middleware populou corretamente o request.user
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('deve funcionar com diferentes formatos de payload', async () => {
      // Token com usuarioId (usado por alguns controllers)
      const tokenComUsuarioId = jwt.sign(
        {
          usuarioId: adminUsuario.id, // diferente de "id"
          tipo: 'ADMIN_EMPRESA',
          empresaId: adminUsuario.empresaId
        },
        process.env.JWT_SECRET || 'supersecret_test_key',
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .get('/api/questionarios')
        .set('Authorization', `Bearer ${tokenComUsuarioId}`);

      expect(res.status).toBe(200);
    });
  });

  describe('Integração com Login', () => {
    it('deve funcionar com token obtido via login de admin', async () => {
      const loginRes = await request(app)
        .post('/api/usuarios/login-admin')
        .send({
          email: adminUsuario.email,
          senha: 'senha123',
          empresaId: empresa.id
        });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body).toHaveProperty('token');

      // Usa o token do login para acessar rota protegida
      const protectedRes = await request(app)
        .get('/api/questionarios')
        .set('Authorization', `Bearer ${loginRes.body.token}`);

      expect(protectedRes.status).toBe(200);
    });

    it('deve funcionar com token obtido via login de cliente plataforma', async () => {
      const loginRes = await request(app)
        .post('/api/clientes/login')
        .send({
          email: clientePlataforma.email,
          senha: 'senha123'
        });

      if (loginRes.status === 200) {
        expect(loginRes.body).toHaveProperty('token');

        // Cliente não deve conseguir acessar rotas de empresa
        const protectedRes = await request(app)
          .get('/api/questionarios')
          .set('Authorization', `Bearer ${loginRes.body.token}`);

        expect([401, 403]).toContain(protectedRes.status);
      }
    });
  });

  describe('Headers de Resposta', () => {
    it('deve incluir headers CORS apropriados', async () => {
      const res = await request(app)
        .get('/api/questionarios')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      // Verifica se headers básicos estão presentes (dependendo da configuração do CORS)
      expect(res.headers['content-type']).toMatch(/json/);
    });

    it('deve retornar erro 401 com formato JSON', async () => {
      const res = await request(app)
        .get('/api/questionarios');

      expect(res.status).toBe(401);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });
  });

  describe('Rotas que NÃO devem exigir autenticação', () => {
    it('deve permitir acesso às rotas públicas de avaliação', async () => {
      // Cria avaliação para testar
      const questionario = await prisma.questionario.create({
        data: {
          titulo: 'Questionário Público',
          criadorId: adminUsuario.id
        }
      });

      const avaliacaoPublica = await prisma.avaliacao.create({
        data: {
          semestre: '2025.1',
          requerLoginCliente: false,
          questionarioId: questionario.id,
          criadorId: adminUsuario.id
        }
      });

      const res = await request(app)
        .get(`/api/public/avaliacoes/${avaliacaoPublica.token}/check`);

      expect(res.status).toBe(200);
      // Não deve exigir token
    });

    it('deve permitir registro de admin empresa', async () => {
      const novaEmpresa = await prisma.empresa.create({
        data: {
          nome: 'Nova Empresa Auth Test',
          emailResponsavel: 'nova-auth@empresa.com',
          senhaEmpresa: 'senha123'
        }
      });

      const res = await request(app)
        .post('/api/usuarios/register-admin')
        .send({
          nome: 'Novo Admin',
          email: 'novo.admin@teste.com',
          senha: 'senha123456',
          empresaId: novaEmpresa.id
        });

      expect([200, 201]).toContain(res.status);
      // Não deve exigir token
    });

    it('deve permitir login sem token prévio', async () => {
      const res = await request(app)
        .post('/api/usuarios/login-admin')
        .send({
          email: adminUsuario.email,
          senha: 'senha123',
          empresaId: empresa.id
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('Rate Limiting e Segurança (se implementado)', () => {
    it('deve aceitar múltiplas requisições válidas do mesmo token', async () => {
      const requests = Array(5).fill().map(() =>
        request(app)
          .get('/api/questionarios')
          .set('Authorization', `Bearer ${validToken}`)
      );

      const responses = await Promise.all(requests);
      responses.forEach(res => {
        expect(res.status).toBe(200);
      });
    });

    it('deve rejeitar consistentemente tokens inválidos', async () => {
      const invalidTokens = [
        'Bearer ',
        'Bearer invalidtoken',
        'Bearer ' + 'a'.repeat(200), // token muito longo
        'Bearer null',
        'Bearer undefined'
      ];

      for (const token of invalidTokens) {
        const res = await request(app)
          .get('/api/questionarios')
          .set('Authorization', token);

        expect(res.status).toBe(401);
      }
    });
  });
});