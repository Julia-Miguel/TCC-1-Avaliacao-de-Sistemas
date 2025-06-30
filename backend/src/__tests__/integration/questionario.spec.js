// src/__tests__/integration/questionario.spec.js
import request from 'supertest';
import { app } from '../../server.js';
import { PrismaClient, TipoUsuario } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Questionario Routes (Protected)', () => {
  let adminToken;

  beforeAll(async () => {
    await prisma.usuario.deleteMany();
    await prisma.empresa.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 8);
    
    const empresa = await prisma.empresa.create({
      data: {
        nome: 'Empresa de Teste de Questionario',
        emailResponsavel: 'resp.questionario@teste.com',
        senhaEmpresa: hashedPassword,
      },
    });

    await prisma.usuario.create({
      data: {
        nome: 'Admin de Questionario',
        email: 'admin.questionario@teste.com',
        senha: hashedPassword,
        tipo: TipoUsuario.ADMIN_EMPRESA,
        empresaId: empresa.id,
      },
    });

    const loginResponse = await request(app)
      .post('/admin/login')
      .send({
        email: 'admin.questionario@teste.com',
        senha: 'password123',
        empresaId: empresa.id,
      });
    
    adminToken = loginResponse.body.token;
  });

  beforeEach(async () => {
    await prisma.questionario.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be able to create a new questionario when authenticated', async () => {
    const questionarioData = {
      titulo: 'Questionário de Satisfação', // Alterado de 'nome' para 'titulo'
    };

    const response = await request(app)
      .post('/questionarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(questionarioData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.titulo).toBe('Questionário de Satisfação'); // Alterado de 'nome' para 'titulo'

    const questionarioInDb = await prisma.questionario.findFirst({
      where: { titulo: 'Questionário de Satisfação' }, // Alterado de 'nome' para 'titulo'
    });
    expect(questionarioInDb).toBeTruthy();
  });

  it('should NOT be able to create a new questionario without a token', async () => {
    const questionarioData = {
      titulo: 'Questionário Secreto', // Alterado de 'nome' para 'titulo'
    };

    const response = await request(app)
      .post('/questionarios')
      .send(questionarioData);

    expect(response.status).toBe(401);
  });

  it('should NOT be able to create a new questionario with an invalid token', async () => {
    const questionarioData = {
      titulo: 'Questionário Inválido', // Alterado de 'nome' para 'titulo'
    };

    const response = await request(app)
      .post('/questionarios')
      .set('Authorization', 'Bearer tokeninvalido123')
      .send(questionarioData);

    expect(response.status).toBe(401);
  });
});