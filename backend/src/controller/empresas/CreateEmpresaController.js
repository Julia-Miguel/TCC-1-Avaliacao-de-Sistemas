// backend/src/controller/empresas/CreateEmpresaController.js
import { prisma } from '../../database/client.js';
import bcrypt from 'bcryptjs'; // Para hashear a senha

export class CreateEmpresaController {
    async handle(request, response) {
        const { nome, emailResponsavel, senhaEmpresa } = request.body;

        // Validação básica
        if (!nome || !emailResponsavel || !senhaEmpresa) {
            return response.status(400).json({
                message: "Dados incompletos. Nome, email do responsável e senha da empresa são obrigatórios."
            });
        }

        try {
            // Verificar se já existe uma empresa com este email ou nome
            const empresaExistente = await prisma.empresa.findFirst({
                where: {
                    OR: [
                        { emailResponsavel: emailResponsavel },
                        { nome: nome }
                    ]
                }
            });

            if (empresaExistente) {
                return response.status(400).json({
                    message: "Já existe uma empresa cadastrada com este nome ou email."
                });
            }

            // Hashear a senha da empresa
            const salt = await bcrypt.genSalt(10);
            const senhaEmpresaHashed = await bcrypt.hash(senhaEmpresa, salt);

            // Criar a empresa
            const empresa = await prisma.empresa.create({
                data: {
                    nome,
                    emailResponsavel,
                    senhaEmpresa: senhaEmpresaHashed
                    // Outros campos da empresa podem ser adicionados aqui
                },
                // Podemos selecionar os campos que queremos retornar, excluindo a senha
                select: {
                    id: true,
                    nome: true,
                    emailResponsavel: true,
                    created_at: true,
                    updated_at: true
                }
            });

            return response.status(201).json(empresa);

        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Erro interno ao criar empresa." });
        }
    }
}