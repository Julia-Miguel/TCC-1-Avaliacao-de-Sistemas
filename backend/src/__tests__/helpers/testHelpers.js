// src/__tests__/helpers/testHelpers.js
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/client.js';


if (typeof global.jest === 'undefined') {
    global.jest = {
        spyOn(obj, methodName) {
            const original = obj[methodName];
            return {
                mockImplementation(fn) { obj[methodName] = fn; },
                mockRestore() { obj[methodName] = original; }
            };
        },
        restoreAllMocks() { /* noop */ }
    };
}

export async function cleanDatabase() {
    const safeDelete = async (fn) => {
        try { 
            await fn(); 
        } catch (e) { 
            console.error('Error during safeDelete:', e); 
        }
    };

    // Respostas dependem de UsuAval e Pergunta
    await safeDelete(() => prisma.resposta.deleteMany());
    // QuePerg (pivot questionario <-> pergunta)
    await safeDelete(() => prisma.quePerg.deleteMany());
    // UsuAval depende de Avaliacao
    await safeDelete(() => prisma.usuAval.deleteMany());
    // Avaliacao depende de Questionario
    await safeDelete(() => prisma.avaliacao.deleteMany());
    // Questionario deve ser removido antes das perguntas/opcoes se houver FK
    await safeDelete(() => prisma.questionario.deleteMany());
    // Opcao depende de Pergunta
    await safeDelete(() => prisma.opcao.deleteMany());
    // Pergunta (agora sem vínculos)
    await safeDelete(() => prisma.pergunta.deleteMany());
    // Usuarios e Empresas por fim
    await safeDelete(() => prisma.usuario.deleteMany());
    await safeDelete(() => prisma.empresa.deleteMany());
}

/**
 * Cria uma empresa de teste com usuário admin e token JWT para autenticação.
 * Retorna { admin, empresa, authToken }.
 */
export async function createTestCompany(suffix = '') {
    const emailResponsavel = `test${suffix}@empresa.test`;
    const nomeEmpresa = `Empresa Teste ${suffix}`;

    const empresa = await prisma.empresa.create({
        data: {
            nome: nomeEmpresa,
            emailResponsavel,
            senhaEmpresa: 'test-senha',
        }
    });

    const adminEmail = `admin${suffix}@test.local`;
    const admin = await prisma.usuario.create({
        data: {
            email: adminEmail,
            tipo: 'ADMIN_EMPRESA',
            empresaId: empresa.id,
            nome: `Admin ${suffix}`
        }
    });

    // Gera token JWT simples para testes. Ajuste secret se necessário.
    const secret = process.env.JWT_SECRET || process.env.SECRET || 'test-secret';
    const payload = {
        id: admin.id,
        empresaId: empresa.id,
        tipo: admin.tipo,
        email: admin.email
    };

    const authToken = jwt.sign(payload, secret, { expiresIn: '7d' });

    return { admin, empresa, authToken };
}

/**
 * Cria um questionário mínimo para testes, e conecta perguntas via QuePerg.
 * Retorna { questionario, perguntas }.
 */
export async function createTestQuestionario(criadorId, withPerguntas = true) {
    const questionario = await prisma.questionario.create({
        data: {
            titulo: `Questionário Teste - ${Date.now()}`,
            criadorId,
        }
    });

    if (!withPerguntas) {
        const q = await prisma.questionario.findUnique({ where: { id: questionario.id } });
        return { questionario: q, perguntas: [] };
    }

    // cria perguntas e os registros em QuePerg para associar ao questionario
    const p1 = await prisma.pergunta.create({
        data: {
            enunciado: 'Pergunta teste 1',
            tipos: 'TEXTO',
            obrigatoria: true,
            ordem: 0
        }
    });

    const p2 = await prisma.pergunta.create({
        data: {
            enunciado: 'Pergunta teste 2',
            tipos: 'TEXTO',
            obrigatoria: false,
            ordem: 1
        }
    });

    // associa via QuePerg (pivot)
    await prisma.quePerg.create({
        data: {
            questionarioId: questionario.id,
            perguntaId: p1.id,
            ordem: 0
        }
    });

    await prisma.quePerg.create({
        data: {
            questionarioId: questionario.id,
            perguntaId: p2.id,
            ordem: 1
        }
    });

    // Recarrega questionário com perguntas (inclui estrutura que seus testes esperam)
    const questionarioCompleto = await prisma.questionario.findUnique({
        where: { id: questionario.id },
        include: {
            perguntas: {
                include: { pergunta: true },
                orderBy: { ordem: 'asc' }
            }
        }
    });

    return { questionario: questionarioCompleto, perguntas: [p1, p2] };
}

/* ---------- Asserções / Helpers para os testes ---------- */

export function expectSuccessResponse(res, expectedStatus = 200) {
    if (expectedStatus) {
        expect(res.status).toBe(expectedStatus);
    } else {
        expect([200, 201]).toContain(res.status);
    }
}

export function expectErrorResponse(res, expectedStatus = 400) {
    expect(res.status).toBe(expectedStatus);
}

export function validateRequiredFields(obj, keys = []) {
    keys.forEach(k => expect(obj).toHaveProperty(k));
}

export function validateNoSensitiveFields(obj) {
    const sensitive = ['senha', 'senhaEmpresa', 'password', 'token', 'emailResponsavel'];
    sensitive.forEach(f => expect(obj).not.toHaveProperty(f));
}

/**
 * testCRUDOperations: executa CREATE -> READ -> UPDATE -> DELETE em endpoints REST padrão.
 * Retorna id criado.
 */
export async function testCRUDOperations(requestAgent, basePath, authToken, crudTestData) {
    // CREATE
    const createRes = await requestAgent
        .post(basePath)
        .set('Authorization', `Bearer ${authToken}`)
        .send(crudTestData.create);

    expect([200, 201]).toContain(createRes.status);
    const createdId = createRes.body?.id ?? createRes.body?.data?.id;
    expect(createdId).toBeDefined();

    // READ
    const getRes = await requestAgent
        .get(`${basePath}/${createdId}`)
        .set('Authorization', `Bearer ${authToken}`);
    expect([200]).toContain(getRes.status);

    // UPDATE
    let updateRes = await requestAgent
        .put(`${basePath}/${createdId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(crudTestData.update);

    if (updateRes.status === 404) {
        updateRes = await requestAgent
            .patch(`${basePath}/${createdId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(crudTestData.update);
    }

    expect([200, 204]).toContain(updateRes.status);

    // DELETE
    const deleteRes = await requestAgent
        .delete(`${basePath}/${createdId}`)
        .set('Authorization', `Bearer ${authToken}`);
    expect([200, 204]).toContain(deleteRes.status);

    return createdId;
}

export const DEFAULT_TEST_DATA = {
    pergunta: {
        enunciado: 'Pergunta padrão teste',
        tipos: 'TEXTO',
        obrigatoria: true
    }
};
