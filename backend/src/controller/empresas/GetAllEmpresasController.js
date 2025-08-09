import { prisma } from '../../database/client.js';

export class GetAllEmpresasController {
    async handle(request, response) {
        try {
            const empresas = await prisma.empresa.findMany({
                select: {
                    id: true,
                    nome: true,
                    emailResponsavel: true,
                    created_at: true,
                    updated_at: true
                }
            });
            return response.json(empresas);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Erro interno ao buscar empresas." });
        }
    }
}