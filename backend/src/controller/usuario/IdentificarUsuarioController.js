// ✅ NOVO ARQUIVO: backend/src/controller/usuario/IdentificarUsuarioController.js
import { prisma } from '../../database/client.js';

export class IdentificarUsuarioController {
  async handle(request, response) {
    const { nome, email } = request.body;

    if (!nome || !email) {
      return response.status(400).json({ message: "Nome e e-mail são obrigatórios." });
    }

    try {
      const usuario = await prisma.usuario.upsert({
        where: { email: email.toLowerCase() },
        update: {
          nome,
        },
        create: {
          nome,
          email: email.toLowerCase(),
          tipo: 'CLIENTE_AVALIACAO',
        },
      });

      return response.status(200).json({ usuarioId: usuario.id });

    } catch (error) {
      console.error("Erro ao identificar usuário:", error);
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}