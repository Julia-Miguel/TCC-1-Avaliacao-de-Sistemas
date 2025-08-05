import { prisma } from "../../database/client.js";

export class GetByIdUsuarioController {
  async handle(request, response) {
    const { id } = request.params;
    const { empresaId } = request.user;

    try {
      const usuario = await prisma.usuario.findFirst({
        where: {
          id: parseInt(id),
          empresaId: parseInt(empresaId),
        },
      });

      if (!usuario) {
        return response.status(404).json({
          message: `Usuário com id ${id} não encontrado ou não pertence à sua empresa.`,
        });
      }
      
      const { senha, ...userWithoutPassword } = usuario;
      return response.json(userWithoutPassword);

    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}
