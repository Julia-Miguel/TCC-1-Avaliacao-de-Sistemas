// ✅ ARQUIVO DE TESTE COMPLETO E CORRIGIDO: src/__tests__/integration/quePerg.spec.js

import request from 'supertest';
import { app } from '../../server.js';
import { PrismaClient, TipoUsuario, TipoPergunta } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Rotas de Associação Pergunta-Questionário (/queperg)', () => {
    let adminToken;
    let questionario;
    let pergunta;

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
                nome: 'Empresa de Teste de Associação',
                emailResponsavel: 'resp.associacao@teste.com',
                senhaEmpresa: hashedPassword,
            },
        });

        const admin = await prisma.usuario.create({
            data: {
                nome: 'Admin de Associação',
                email: 'admin.associacao@teste.com',
                senha: hashedPassword,
                tipo: TipoUsuario.ADMIN_EMPRESA,
                empresaId: empresa.id,
            },
        });

        const loginResponse = await request(app)
            .post('/usuarios/login-admin')
            .send({ email: admin.email, senha: 'password123', empresaId: empresa.id });
        adminToken = loginResponse.body.token;

        // Cria um questionário e uma pergunta para usarmos nos testes
        questionario = await prisma.questionario.create({
            data: { titulo: "Questionário Base", criadorId: admin.id }
        });

        pergunta = await prisma.pergunta.create({
            data: { enunciado: "Pergunta para associar", tipos: TipoPergunta.TEXTO }
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    // Limpa a tabela de associação antes de cada teste
    beforeEach(async () => {
        await prisma.quePerg.deleteMany({});
    });

    describe('POST /queperg', () => {
        it('deve associar uma pergunta a um questionário com sucesso', async () => {
            const response = await request(app)
                .post('/queperg')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    questionarioId: questionario.id,
                    perguntaId: pergunta.id
                });

            expect(response.status).toBe(201);
            expect(response.body.questionarioId).toBe(questionario.id);
            expect(response.body.perguntaId).toBe(pergunta.id);

            const associacao = await prisma.quePerg.findFirst();
            expect(associacao).not.toBeNull();
        });
    });

    describe('GET /queperg?questionarioId=:id', () => {
        it('deve listar as perguntas de um questionário específico', async () => {
            await prisma.quePerg.create({
                data: {
                    questionarioId: questionario.id,
                    perguntaId: pergunta.id
                }
            });

            const response = await request(app)
                .get(`/queperg?questionarioId=${questionario.id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0].pergunta.enunciado).toBe(pergunta.enunciado);
        });
    });

    describe('DELETE /queperg/:id', () => {
        it('deve remover a associação entre uma pergunta e um questionário', async () => {
            const associacao = await prisma.quePerg.create({
                data: {
                    questionarioId: questionario.id,
                    perguntaId: pergunta.id
                }
            });

            // ✅ CORREÇÃO: Passando o ID na URL da rota DELETE
            const response = await request(app)
                .delete(`/queperg/${associacao.id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).toBe(200);

            const associacaoNoDB = await prisma.quePerg.findUnique({ where: { id: associacao.id }});
            expect(associacaoNoDB).toBeNull();
        });
    });
});
