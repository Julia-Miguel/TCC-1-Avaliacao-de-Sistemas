import { prisma } from '../../database/client.js';

export class DeleteUsuarioController {
    async handle(request, response) {
        const { id } = request.params;
        const { id: loggedInUserId } = request.user;

        try {
            if (parseInt(id) !== parseInt(loggedInUserId)) {
                return response.status(403).json({ message: "Você só pode excluir o seu próprio usuário." });
            }
            await prisma.usuario.delete({
                where: {
                    id: parseInt(id)
                }
            });
            return response.status(200).json({ message: 'Usuário excluído com sucesso.' });
        } catch (error) {
            if (error.code === 'P2025') {
                return response.status(404).json({ message: "Usuário não encontrado." });
            }
            console.error(error);
            return response.status(500).json({ message: `Erro ao deletar usuário.` });
        }
    }
}
