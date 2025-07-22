import request from 'supertest';
import { app } from '../../server.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Rotas de Empresa', () => {
    // Limpa o banco antes de cada teste para garantir isolamento
    beforeEach(async () => {
        // ✅ ORDEM DE LIMPEZA CORRIGIDA E COMPLETA
        // Esta é a mesma ordem segura dos outros testes
        await prisma.resposta.deleteMany({});
        await prisma.quePerg.deleteMany({});
        await prisma.pergunta.deleteMany({});
        await prisma.avaliacao.deleteMany({});
        await prisma.questionario.deleteMany({});
        await prisma.usuario.deleteMany({});
        await prisma.empresa.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /empresas/register', () => {
        it('deve criar uma nova empresa com sucesso e retornar status 201', async () => {
            const novaEmpresa = {
                nome: 'Empresa de Teste Finalíssima',
                emailResponsavel: 'contato@finalissima.com',
                senhaEmpresa: 'senhaforte123',
            };

            const response = await request(app)
                .post('/empresas/register')
                .send(novaEmpresa);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.nome).toBe(novaEmpresa.nome);
        });

        it('deve retornar erro 400 ao tentar registrar com um email já existente', async () => {
            // Cria uma empresa para o teste
            await prisma.empresa.create({
                data: {
                    nome: 'Empresa Super Existente',
                    emailResponsavel: 'email.super.duplicado@teste.com',
                    senhaEmpresa: 'senha123',
                },
            });

            // Tenta criar outra com o mesmo e-mail
            const response = await request(app)
                .post('/empresas/register')
                .send({
                    nome: 'Outra Empresa',
                    emailResponsavel: 'email.super.duplicado@teste.com',
                    senhaEmpresa: 'outrasenha',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Já existe uma empresa cadastrada com este nome ou email.');
        });
    });
});