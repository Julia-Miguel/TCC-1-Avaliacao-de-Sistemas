// src/controller/usuario/DeleteUsuarioController.js
import { prisma } from '../../database/client.js';

export class DeleteUsuarioController {
    async handle(request, response) {
        // ✅ CORREÇÃO: Pegando o 'id' dos parâmetros da URL
        const { id } = request.params;

        try {
            await prisma.usuario.delete({
                where: {
                    id: parseInt(id)
                }
            });
            return response.status(200).json({ message: 'Usuário excluído com sucesso.' });
        } catch (error) {
            // Adiciona tratamento para caso o usuário não seja encontrado
            if (error.code === 'P2025') {
                return response.status(404).json({ message: "Usuário não encontrado." });
            }
            console.error(error);
            return response.status(500).json({ message: `Erro ao deletar usuário.` });
        }
    }
}