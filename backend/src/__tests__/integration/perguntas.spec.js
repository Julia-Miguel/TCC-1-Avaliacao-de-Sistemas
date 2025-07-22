// ✅ ARQUIVO DE TESTE CORRIGIDO: src/__tests__/integration/perguntas.spec.js

import request from 'supertest';
import { app } from '../../server.js';
import { PrismaClient, TipoUsuario, TipoPergunta } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Rotas de Perguntas (/perguntas)', () => {
    let adminToken;
    let perguntaParaTestes;

    beforeAll(async () => {
        // Limpeza do banco
        await prisma.resposta.deleteMany({});
        await prisma.quePerg.deleteMany({});
        await prisma.pergunta.deleteMany({});
        await prisma.avaliacao.deleteMany({});
        await prisma.questionario.deleteMany({});
        await prisma.usuario.deleteMany({});
        await prisma.empresa.deleteMany({});

        // Setup de empresa e admin
        const hashedPassword = await bcrypt.hash('password123', 8);
        const empresa = await prisma.empresa.create({
            data: {
                nome: 'Empresa de Teste de Perguntas',
                emailResponsavel: 'resp.perguntas@teste.com',
                senhaEmpresa: hashedPassword,
            },
        });
        const admin = await prisma.usuario.create({
            data: {
                nome: 'Admin de Perguntas',
                email: 'admin.perguntas@teste.com',
                senha: hashedPassword,
                tipo: TipoUsuario.ADMIN_EMPRESA,
                empresaId: empresa.id,
            },
        });

        // Obtenção do token
        const loginResponse = await request(app)
            .post('/usuarios/login-admin')
            .send({ email: admin.email, senha: 'password123', empresaId: empresa.id });
        adminToken = loginResponse.body.token;
    });

    beforeEach(async () => {
        await prisma.pergunta.deleteMany({});
        perguntaParaTestes = await prisma.pergunta.create({
            data: {
                enunciado: 'Qual é a sua cor favorita?',
                // ✅ CORREÇÃO: Usando 'tipos' (plural)
                tipos: TipoPergunta.TEXTO,
                obrigatoria: true
            }
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /perguntas', () => {
        it('deve criar uma nova pergunta', async () => {
            const response = await request(app)
                .post('/perguntas')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    enunciado: 'Qual sua opinião sobre o nosso serviço?',
                    // ✅ CORREÇÃO: Usando 'tipos' (plural)
                    tipos: TipoPergunta.TEXTO,
                    obrigatoria: true
                });

            expect(response.status).toBe(201);
            expect(response.body.enunciado).toBe('Qual sua opinião sobre o nosso serviço?');
        });
    });

    describe('GET /perguntas', () => {
        it('deve listar todas as perguntas existentes', async () => {
            const response = await request(app)
                .get('/perguntas')
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /perguntas/:id', () => {
        it('deve buscar uma pergunta pelo ID', async () => {
            const response = await request(app)
                .get(`/perguntas/${perguntaParaTestes.id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(response.status).toBe(200);
            expect(response.body.enunciado).toBe(perguntaParaTestes.enunciado);
        });
    });

    describe('PATCH /perguntas/:id', () => {
        it('deve atualizar o enunciado de uma pergunta', async () => {
            const novoEnunciado = "Qual é a sua comida favorita?";
            const response = await request(app)
                .patch(`/perguntas/${perguntaParaTestes.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ enunciado: novoEnunciado });

            expect(response.status).toBe(200);
            expect(response.body.enunciado).toBe(novoEnunciado);
        });
    });

    describe('DELETE /perguntas/:id', () => {
        it('deve deletar uma pergunta', async () => {
            const response = await request(app)
                .delete(`/perguntas/${perguntaParaTestes.id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Pergunta excluída com sucesso.');

            const perguntaNoDB = await prisma.pergunta.findUnique({ where: { id: perguntaParaTestes.id } });
            expect(perguntaNoDB).toBeNull();
        });
    });
});
