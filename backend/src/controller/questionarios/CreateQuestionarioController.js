// backend/src/controller/questionarios/CreateQuestionarioController.js
import { prisma } from '../../database/client.js';

export class CreateQuestionarioController {
  async handle(request, response) {
    // Verifique se request.user e as propriedades esperadas existem
    // A propriedade do ID do usuário no token é 'usuarioId'
    if (!request.user || !request.user.usuarioId) { 
        return response.status(401).json({ message: "Usuário não autenticado ou ID do usuário não encontrado no token." });
    }
    // Não precisamos verificar 'empresaId' aqui diretamente, pois o 'usuarioId' do token
    // já pertence a um admin de uma empresa específica. A ligação com a empresa é feita
    // através do 'criadorId' (que é o 'usuarioId') no modelo Questionario.

    const { usuarioId: criadorId } = request.user; // Pega o ID do admin logado do token
    const { titulo } = request.body;

    if (!titulo || !titulo.trim()) { // Adicionada verificação de trim()
      return response.status(400).json({ message: "Título é obrigatório." });
    }

    // A verificação "!criadorId" é redundante por causa da verificação "!request.user || !request.user.usuarioId" acima.
    // Se request.user.usuarioId existir, criadorId também existirá.

    try {
      const questionario = await prisma.questionario.create({
        data: {
          titulo: titulo.trim(),
          criadorId: parseInt(criadorId) // Garante que é número e usa o ID do admin logado
        }
        // Não é necessário incluir o 'criador' aqui na resposta de criação,
        // a menos que você precise imediatamente no frontend. Geralmente,
        // ao listar, você faria o include.
      });
      return response.status(201).json(questionario);
    } catch (error) {
      console.error("Erro ao criar questionário no controller:", error);
      // Verifica se o erro é de constraint de chave estrangeira para criadorId
      if (error.code === 'P2003' && error.meta?.field_name?.includes('criadorId')) {
           return response.status(400).json({ message: "Usuário criador (admin) não encontrado no banco de dados. Verifique o ID." });
      }
      return response.status(500).json({ error: "Erro interno do servidor ao criar questionário." });
    }
  }
}