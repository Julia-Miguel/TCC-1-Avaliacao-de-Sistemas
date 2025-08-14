// backend/src/__tests__/integration/empresa.spec.js
import request from 'supertest';
import { app } from '../../server.js';
import { prisma } from '../../database/client.js';

describe('Rotas de Empresas', () => {

  it('deve ser capaz de criar uma nova empresa', async () => {
    const response = await request(app)
      .post('/api/empresas') 
      .send({
        nome: "Empresa Teste JS",
        emailResponsavel: "contato@testejs.com",
        senhaEmpresa: "senhaForte123"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');

    const empresaNoDb = await prisma.empresa.findUnique({
      where: { emailResponsavel: "contato@testejs.com" }
    });
    expect(empresaNoDb).not.toBeNull();
  });

  it('não deve ser capaz de criar uma empresa com um email já existente', async () => {
    await request(app)
      .post('/api/empresas')
      .send({
        nome: "Empresa Original JS",
        emailResponsavel: "duplicado@testejs.com",
        senhaEmpresa: "123"
      });

    const response = await request(app)
      .post('/api/empresas')
      .send({
        nome: "Empresa Fantasma JS",
        emailResponsavel: "duplicado@testejs.com",
        senhaEmpresa: "456"
      });
    
    expect(response.status).toBe(400);
  });
});