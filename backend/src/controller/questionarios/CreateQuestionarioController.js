// backend/src/controller/questionarios/CreateQuestionarioController.js
import { prisma } from '../../database/client.js';

export class CreateQuestionarioController {
  async handle(request, response) {
    const { usuarioId: criadorId, empresaId: adminEmpresaId } = request.user || {};
    const { titulo, eh_satisfacao, perguntas } = request.body;

    if (!criadorId || !adminEmpresaId) {
      return response.status(401).json({ message: "Usuário não autenticado ou ID da empresa não encontrado no token." });
    }

    if (typeof titulo !== 'string' || !titulo.trim()) {
      return response.status(400).json({ message: "Título é obrigatório e deve ser string." });
    }

    // Se perguntas vieram, valida o tipo do campo inteiro (o teste considera inválido quando não for array)
    if (perguntas !== undefined && !Array.isArray(perguntas)) {
      return response.status(400).json({ message: "Campo 'perguntas' deve ser um array quando fornecido." });
    }

    // Se perguntas vieram, valida conteúdo (enunciado obrigatoriamente string não vazia)
    if (Array.isArray(perguntas)) {
      for (const [i, p] of perguntas.entries()) {
        if (!p || typeof p !== 'object') {
          return response.status(400).json({ message: `Pergunta na posição ${i} é inválida.` });
        }
        if (typeof p.enunciado !== 'string' || !p.enunciado.trim()) {
          return response.status(400).json({ message: `Pergunta na posição ${i} requer 'enunciado' como string não vazia.` });
        }
        if (p.tipos !== undefined && typeof p.tipos !== 'string') {
          return response.status(400).json({ message: `Pergunta na posição ${i} tem 'tipos' inválido.` });
        }
        if (p.opcoes !== undefined && !Array.isArray(p.opcoes)) {
          return response.status(400).json({ message: `Pergunta na posição ${i} tem 'opcoes' que deve ser array.` });
        }
        if (Array.isArray(p.opcoes)) {
          for (const [j, opt] of p.opcoes.entries()) {
            if (!opt || typeof opt.texto !== 'string' || !opt.texto.trim()) {
              return response.status(400).json({ message: `Opção ${j} da pergunta ${i} é inválida.` });
            }
          }
        }
      }
    }

    try {
      if (eh_satisfacao === true) {
        const satisfacaoExistente = await prisma.questionario.findFirst({
          where: {
            eh_satisfacao: true,
            criador: { empresaId: parseInt(adminEmpresaId, 10) }
          }
        });

        if (satisfacaoExistente) {
          return response.status(409).json({ message: "Sua empresa já possui um questionário de satisfação. Apenas um é permitido." });
        }
      }

      // Cria o questionário
      const questionario = await prisma.questionario.create({
        data: {
          titulo: titulo.trim(),
          criadorId: parseInt(criadorId, 10),
          eh_satisfacao: !!eh_satisfacao,
        }
      });

      // Cria perguntas (e opcoes / QuePerg pivot) se enviadas
      if (Array.isArray(perguntas) && perguntas.length > 0) {
        for (let i = 0; i < perguntas.length; i++) {
          const p = perguntas[i];
          const tipos = typeof p.tipos === 'string' ? p.tipos : 'TEXTO';
          const obrigatoria = !!p.obrigatoria;
          const ordem = Number.isInteger(p.ordem) ? p.ordem : i;

          const perguntaCriada = await prisma.pergunta.create({
            data: {
              enunciado: p.enunciado.trim(),
              tipos,
              obrigatoria,
              ordem
            }
          });

          await prisma.quePerg.create({
            data: {
              questionarioId: questionario.id,
              perguntaId: perguntaCriada.id,
              ordem
            }
          });

          if (tipos === 'MULTIPLA_ESCOLHA' && Array.isArray(p.opcoes) && p.opcoes.length > 0) {
            await prisma.opcao.createMany({
              data: p.opcoes
                .filter(o => o && typeof o.texto === 'string' && o.texto.trim())
                .map(o => ({ texto: o.texto.trim(), perguntaId: perguntaCriada.id }))
            });
          }
        }
      }

      const questionarioCompleto = await prisma.questionario.findUnique({
        where: { id: questionario.id },
        include: {
          perguntas: {
            orderBy: { ordem: 'asc' },
            include: {
              pergunta: { include: { opcoes: true } }
            }
          }
        }
      });

      return response.status(201).json(questionarioCompleto);

    } catch (error) {
      console.error("Erro ao criar questionário no controller:", error);
      return response.status(500).json({ error: "Erro interno do servidor ao criar questionário." });
    }
  }
}
