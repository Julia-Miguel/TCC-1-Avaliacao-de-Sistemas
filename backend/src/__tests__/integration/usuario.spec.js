import request from 'supertest';
import { app } from '../../server.js';
import { PrismaClient, TipoUsuario } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Rotas de Usuário (/usuario)', () => {
    let adminToken;

    beforeAll(async () => {
        // Limpeza simplificada e segura
        await prisma.quePerg.deleteMany({});
        await prisma.pergunta.deleteMany({});
        await prisma.avaliacao.deleteMany({});
        await prisma.questionario.deleteMany({});
        await prisma.usuario.deleteMany({});
        await prisma.empresa.deleteMany({});

        const empresaTest = await prisma.empresa.create({
            data: {
                nome: 'Empresa Usuários Finalíssima',
                emailResponsavel: 'resp.usuarios.finalissima@teste.com',
                senhaEmpresa: await bcrypt.hash('password123', 8),
            },
        });

        const adminUser = await prisma.usuario.create({
            data: {
                nome: 'Admin Usuários Finalíssimo',
                email: 'admin.usuarios.finalissima@teste.com',
                senha: await bcrypt.hash('password123', 8),
                tipo: TipoUsuario.ADMIN_EMPRESA,
                empresaId: empresaTest.id,
            },
        });

        const loginResponse = await request(app)
            .post('/usuarios/login-admin')
            .send({ 
                email: adminUser.email, 
                senha: 'password123',
                empresaId: empresaTest.id // ✅ CAMPO ADICIONADO
            });
        adminToken = loginResponse.body.token;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('GET /usuario (Protegido)', () => {
        it('deve listar todos os usuários com token de admin', async () => {
            const response = await request(app)
                .get('/usuario')
                .set('Authorization', `Bearer ${adminToken}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('NÃO deve listar usuários sem token', async () => {
            const response = await request(app).get('/usuario');
            expect(response.status).toBe(401);
        });
    });
});
