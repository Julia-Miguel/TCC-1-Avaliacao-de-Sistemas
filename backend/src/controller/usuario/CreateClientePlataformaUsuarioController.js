// backend/src/controller/usuario/CreateClientePlataformaUsuarioController.js
import { prisma } from '../../database/client.js';
import bcrypt from 'bcryptjs';

export class CreateClientePlataformaUsuarioController {
    async handle(request, response) {
        const { nome, email, senha } = request.body;

        if (!email || !senha) {
            return response.status(400).json({
                message: "Dados incompletos. Email e senha são obrigatórios."
            });
        }
        if (senha.length < 6) {
             return response.status(400).json({ message: "A senha deve ter pelo menos 6 caracteres." });
        }

        try {
            // Verificar se o email já está em uso
            const usuarioExistente = await prisma.usuario.findUnique({
                where: { email: email }
            });

            if (usuarioExistente) {
                return response.status(400).json({ message: "Este email já está em uso." });
            }

            // Hashear a senha
            const salt = await bcrypt.genSalt(10);
            const senhaHashed = await bcrypt.hash(senha, salt);

            // Criar o usuário cliente
            const novoCliente = await prisma.usuario.create({
                data: {
                    nome: nome || null, // Permite nome nulo se não fornecido
                    email,
                    senha: senhaHashed,
                    tipo: 'CLIENTE_PLATAFORMA', // Tipo específico para cliente
                    empresaId: null // Cliente da plataforma não tem empresaId direto
                },
                select: { // Retornar dados seguros
                    id: true,
                    nome: true,
                    email: true,
                    tipo: true,
                    created_at: true
                }
            });

            return response.status(201).json(novoCliente);

        } catch (error) {
            console.error("Erro ao registrar cliente da plataforma:", error);
            return response.status(500).json({ message: "Erro interno ao registrar cliente." });
        }
    }
}