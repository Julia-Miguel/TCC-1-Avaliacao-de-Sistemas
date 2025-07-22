// ✅ NOVO ARQUIVO DE TESTE: src/__tests__/integration/avaliacao.spec.js

import request from 'supertest';
import { app } from '../../server.js';
import { PrismaClient, TipoUsuario } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Rotas de Avaliação (/avaliacao)', () => {
    let adminToken;
    let admin;
    let questionarioParaTestes;
    let avaliacaoParaTestes;

    beforeAll(async () => {
        // Limpeza completa do banco
        await prisma.resposta.deleteMany({});
        await prisma.quePerg.deleteMany({});
        await prisma.pergunta.deleteMany({});
        await prisma.avaliacao.deleteMany({});
        await prisma.questionario.deleteMany({});
        await prisma.usuario.deleteMany({});
        await prisma.empresa.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 8);
        
        const empresa = await prisma.empresa.create({
            data: {
                nome: 'Empresa de Teste de Avaliação',
                emailResponsavel: 'resp.avaliacao@teste.com',
                senhaEmpresa: hashedPassword,
            },
        });

        admin = await prisma.usuario.create({
            data: {
                nome: 'Admin de Avaliação',
                email: 'admin.avaliacao@teste.com',
                senha: hashedPassword,
                tipo: TipoUsuario.ADMIN_EMPRESA,
                empresaId: empresa.id,
            },
        });

        questionarioParaTestes = await prisma.questionario.create({
            data: {
                titulo: "Questionário para Avaliações",
                criadorId: admin.id
            }
        });

        const loginResponse = await request(app)
            .post('/usuarios/login-admin')
            .send({ email: admin.email, senha: 'password123', empresaId: empresa.id });
        
        adminToken = loginResponse.body.token;
    });

    beforeEach(async () => {
        await prisma.avaliacao.deleteMany({});
        avaliacaoParaTestes = await prisma.avaliacao.create({
            data: {
                semestre: "2025.1",
                questionarioId: questionarioParaTestes.id,
                criadorId: admin.id
            }
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /avaliacao', () => {
        it('deve criar uma nova avaliação', async () => {
            const response = await request(app)
                .post('/avaliacao')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    semestre: "2025.2",
                    questionarioId: questionarioParaTestes.id
                });

            expect(response.status).toBe(201);
            expect(response.body.semestre).toBe("2025.2");
        });
    });

    describe('GET /avaliacao', () => {
        it('deve listar todas as avaliações', async () => {
            const response = await request(app)
                .get('/avaliacao')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /avaliacao/:id', () => {
        it('deve buscar uma avaliação pelo ID', async () => {
            const response = await request(app)
                .get(`/avaliacao/${avaliacaoParaTestes.id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.semestre).toBe(avaliacaoParaTestes.semestre);
        });
    });

    describe('PUT /avaliacao/:id', () => {
        it('deve atualizar o semestre de uma avaliação', async () => {
            const novoSemestre = "2026.1";
            const response = await request(app)
                .put(`/avaliacao/${avaliacaoParaTestes.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ semestre: novoSemestre });
            
            expect(response.status).toBe(200);
            expect(response.body.semestre).toBe(novoSemestre);
        });
    });

    describe('DELETE /avaliacao/:id', () => {
        it('deve deletar uma avaliação', async () => {
            const response = await request(app)
                .delete(`/avaliacao/${avaliacaoParaTestes.id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Avaliação deletada com sucesso.");

            const avaliacaoNoDB = await prisma.avaliacao.findUnique({
                where: { id: avaliacaoParaTestes.id }
            });
            expect(avaliacaoNoDB).toBeNull();
        });
    });
});