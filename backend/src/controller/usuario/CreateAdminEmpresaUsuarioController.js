// backend/src/controller/usuario/CreateAdminEmpresaUsuarioController.js
import { prisma } from '../../database/client.js';
import bcrypt from 'bcryptjs';

export class CreateAdminEmpresaUsuarioController {
    async handle(request, response) {
        const { nome, email, senha, empresaId } = request.body;

        // Validação básica
        if (!nome || !email || !senha || !empresaId) {
            return response.status(400).json({
                message: "Dados incompletos. Nome, email, senha e ID da empresa são obrigatórios."
            });
        }

        if (senha.length < 6) {
             return response.status(400).json({ message: "A senha deve ter pelo menos 6 caracteres." });
        }

        try {
            // Verificar se a empresa existe
            const empresaExistente = await prisma.empresa.findUnique({
                where: { id: parseInt(empresaId) }
            });

            if (!empresaExistente) {
                return response.status(400).json({ message: "Empresa não encontrada." });
            }

            // Verificar se o email já está em uso
            const usuarioExistente = await prisma.usuario.findUnique({
                where: { email: email }
            });

            if (usuarioExistente) {
                return response.status(400).json({ message: "Este email já está em uso." });
            }

            // Hashear a senha do admin
            const salt = await bcrypt.genSalt(10);
            const senhaHashed = await bcrypt.hash(senha, salt);

            // Criar o usuário admin
            const novoAdmin = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    senha: senhaHashed,
                    tipo: 'ADMIN_EMPRESA', // Definindo o tipo
                    empresaId: parseInt(empresaId) // Vinculando à empresa
                },
                select: { // Selecionando os campos para retornar (sem a senha)
                    id: true,
                    nome: true,
                    email: true,
                    tipo: true,
                    empresaId: true,
                    created_at: true
                }
            });

            return response.status(201).json(novoAdmin);

        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Erro interno ao registrar administrador da empresa." });
        }
    }
}