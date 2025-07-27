import { prisma } from '../../../database/client.js';

export class IdentifiedStartAvaliacaoController {
  async handle(request, response) {
    const { avaliacaoId: avaliacaoIdParam } = request.params;
    const { nome, email } = request.body;
    const avaliacaoId = parseInt(avaliacaoIdParam, 10);

    if (!nome || !email) {
      return response.status(400).json({ message: "Nome e e-mail são obrigatórios." });
    }

    try {
      // 1. Encontra um usuário com este e-mail ou cria um novo
      // O 'upsert' é perfeito para isso: atualiza se existir, cria se não existir.
      const usuario = await prisma.usuario.upsert({
        where: { email: email },
        update: { nome: nome }, // Atualiza o nome caso a pessoa use um diferente
        create: {
          nome,
          email,
          tipo: 'CLIENTE_PLATAFORMA', // Tipo específico para respondentes
        },
      });

      // 2. Inicia a sessão de avaliação (UsuAval) para este usuário
      const usuAval = await prisma.usuAval.create({
        data: {
          avaliacaoId,
          usuarioId: usuario.id,
          status: 'INICIADO',
          isFinalizado: false,
          started_at: new Date(),
        },
      });

      // 3. Busca os dados completos da avaliação para enviar ao frontend
      const avaliacaoCompleta = await prisma.avaliacao.findUnique({
        where: { id: avaliacaoId },
        include: {
          questionario: {
            include: {
              perguntas: {
                orderBy: { ordem: 'asc' },
                include: {
                  pergunta: { include: { opcoes: true } },
                },
              },
            },
          },
        },
      });
      
      const responseData = {
        // ... (monta o objeto de resposta com as perguntas)
        // (código omitido por ser igual ao do outro controller)
      };

      return response.status(200).json(responseData);

    } catch (error) {
      console.error("Erro ao iniciar avaliação identificada:", error);
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}