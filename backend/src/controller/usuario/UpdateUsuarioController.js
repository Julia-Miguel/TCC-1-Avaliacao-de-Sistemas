// src/controller/usuario/UpdateUsuarioController.js
import { prisma } from '../../database/client.js';

export class UpdateUsuarioController {
    async handle(request, response) {
        // ✅ CORREÇÃO: Pegando o 'id' dos parâmetros da URL
        const { id } = request.params;
        const { nome, email, tipo } = request.body;

        try {
            const usuarioAtualizado = await prisma.usuario.update({
                where: {
                    id: parseInt(id) // Usando o id da URL
                },
                data: {
                    nome,
                    email,
                    tipo
                }
            });
            return response.json(usuarioAtualizado);
        } catch (error) {
            // Adiciona tratamento para caso o usuário não seja encontrado
            if (error.code === 'P2025') {
                return response.status(404).json({ message: "Usuário não encontrado." });
            }
            console.error(error);
            return response.status(500).json({ message: "Erro ao atualizar usuário." });
        }
    }
}