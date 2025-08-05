import { prisma } from '../../database/client.js';

export class GetAllUsuarioController {
  async handle(request, response) {
    // Extrai o ID da empresa do usuário logado (fornecido pelo authMiddleware)
    const { empresaId } = request.user;

    if (!empresaId) {
      return response.status(401).json({ message: "ID da empresa não identificado no token." });
    }

    try {
      const usuarios = await prisma.usuario.findMany({
        where: {
          empresaId: parseInt(empresaId)
        },
        select: {
          id: true,
          nome: true,
          email: true,
          tipo: true,
          created_at: true,
          updated_at: true,
        },
      }); 
      
      return response.json(usuarios);

    } catch (error) {
      console.error("Erro ao buscar usuários da empresa:", error);
      return response.status(500).json({ message: "Erro interno ao buscar usuários." });
    }
  }
}