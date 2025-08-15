// backend/src/__tests__/integration/empresa.spec.js
import request from 'supertest';
import { app } from '../../server.js';
import { prisma } from '../../database/client.js';
import bcrypt from 'bcryptjs';

describe('Rotas de Empresa (API E2E)', () => {

  describe('POST /api/empresas/register (Cadastro)', () => {
    it('deve criar uma nova empresa com dados válidos', async () => {
      const response = await request(app)
        .post('/api/empresas/register')
        .send({
          nome: "Empresa de Teste Válida",
          emailResponsavel: "valido@empresa.com",
          senhaEmpresa: "senha123"
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('não deve criar uma empresa com um email já existente', async () => {
      // Cria a primeira empresa
      await request(app)
        .post('/api/empresas/register')
        .send({
          nome: "Empresa Original",
          emailResponsavel: "duplicado@empresa.com",
          senhaEmpresa: "senha123"
        });

      // Tenta criar a segunda com o mesmo email
      const response = await request(app)
        .post('/api/empresas/register') // Rota corrigida
        .send({
          nome: "Empresa Duplicada",
          emailResponsavel: "duplicado@empresa.com",
          senhaEmpresa: "outrasenha"
        });
      
      expect(response.status).toBe(400); // Espera um erro de Bad Request
    });
  });

  describe('POST /api/empresas/login (Login)', () => {
    beforeAll(async () => {
      // Cria uma empresa para os testes de login
      const senhaHash = await bcrypt.hash('senhaCorreta', 8);
      await prisma.empresa.create({
        data: {
          nome: 'Empresa para Login',
          emailResponsavel: 'login.teste@empresa.com',
          senhaEmpresa: senhaHash,
        }
      });
    });

    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/empresas/login')
        .send({
          emailResponsavel: 'login.teste@empresa.com',
          senhaEmpresa: 'senhaCorreta'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('empresa');
    });

    it('não deve fazer login com senha incorreta', async () => {
      const response = await request(app)
        .post('/api/empresas/login')
        .send({
          emailResponsavel: 'login.teste@empresa.com',
          senhaEmpresa: 'senhaErrada'
        });

      expect(response.status).toBe(401);
    });
  });
});