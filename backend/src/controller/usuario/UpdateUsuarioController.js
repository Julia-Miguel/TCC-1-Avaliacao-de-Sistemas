import { prisma } from "../../database/client.js";

export class UpdateUsuarioController {
  async handle(request, response) {
    const { token, nome, email, tipo } = request.body;
    const { empresaId: adminEmpresaId } = request.user;

    if (!token || !nome || !email || !tipo) {
      return response.status(400).json({ message: "Dados incompletos. Token, nome, email e tipo são obrigatórios." });
    }

    try {
      const result = await prisma.usuario.updateMany({
        where: {
          token: token,
          empresaId: parseInt(adminEmpresaId),
        },
        data: {
          nome,
          email,
          tipo,
          updated_at: new Date(),
        },
      });
      if (result.count === 0) {
        return response.status(403).json({ message: "Ação não permitida. O usuário não foi encontrado na sua empresa." });
      }

      const usuarioAtualizado = await prisma.usuario.findUnique({ 
        where: { token: token }
      });
      
      const { senha, ...userWithoutPassword } = usuarioAtualizado;
      
      return response.json(userWithoutPassword);

    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return response.status(409).json({ message: "O email fornecido já está em uso por outro usuário." });
      }
      console.error(error);
      return response.status(500).json({ message: "Erro interno ao atualizar o usuário." });
    }
  }
}