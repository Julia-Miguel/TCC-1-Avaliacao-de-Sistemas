// backend/prisma/seeds.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ADMIN_EMAIL = 'eu@gmail.com';

async function main() {
  console.log('🌱 Iniciando o processo de seeding...');

  const adminUser = await prisma.usuario.findUnique({
    where: { email: ADMIN_EMAIL },
    include: { empresa: true },
  });

  if (!adminUser || !adminUser.empresa) {
    console.error(`❌ Admin "${ADMIN_EMAIL}" não encontrado ou sem empresa.`);
    process.exit(1);
  }

  const empresaId = adminUser.empresaId;

  // LIMPEZA DOS DADOS TRANSACIONAIS
  console.log('🧹 Limpando dados antigos...');
  await prisma.resposta.deleteMany({});
  await prisma.usuAval.deleteMany({});
  await prisma.avaliacao.deleteMany({});
  await prisma.opcao.deleteMany({});
  const qs = await prisma.questionario.findMany({
    where: { criador: { empresaId } }, select: { id: true }
  });
  const idsQs = qs.map(q => q.id);
  if (idsQs.length > 0) {
    await prisma.quePerg.deleteMany({ where: { questionarioId: { in: idsQs } } });
    await prisma.pergunta.deleteMany({
      where: { questionarios: { some: { questionarioId: { in: idsQs } } } }
    });
    await prisma.questionario.deleteMany({ where: { id: { in: idsQs } } });
  }

  // FUNÇÃO AUXILIAR PARA CRIAR QUESTIONÁRIO
  async function criarQuestionario({ titulo, perguntas, totalRespostas = 5 }) {
    const questionario = await prisma.questionario.create({
      data: {
        titulo,
        criadorId: adminUser.id,
      },
    });

    const perguntasCriadas = [];

    for (const [idx, p] of perguntas.entries()) {
      const pergunta = await prisma.pergunta.create({
        data: {
          enunciado: p.enunciado,
          tipos: p.tipo,
          ordem: idx,
          opcoes: p.tipo === 'MULTIPLA_ESCOLHA'
            ? { create: p.opcoes.map(texto => ({ texto })) }
            : undefined,
        },
        include: {
          opcoes: true, // importante para usar nas respostas
        }
      });

      perguntasCriadas.push(pergunta);

      await prisma.quePerg.create({
        data: {
          questionarioId: questionario.id,
          perguntaId: pergunta.id,
        },
      });
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        semestre: '2025/1',
        requerLoginCliente: false,
        questionarioId: questionario.id,
        criadorId: adminUser.id,
      },
    });

    for (let i = 0; i < totalRespostas; i++) {
      const sessionId = `anon-${Math.random().toString(36).slice(2, 10)}`;
      const usuAval = await prisma.usuAval.create({
        data: {
          avaliacaoId: avaliacao.id,
          anonymousSessionId: sessionId,
          status: 'CONCLUIDO',
          isFinalizado: true,
        }
      });

      for (const pergunta of perguntasCriadas) {
        const respostaTexto = pergunta.tipos === 'MULTIPLA_ESCOLHA'
          ? (pergunta.opcoes[Math.floor(Math.random() * pergunta.opcoes.length)]?.texto ?? 'Sem opção')
          : `Texto simulado ${Math.random().toString(36).slice(4, 10)}`;

        await prisma.resposta.create({
          data: {
            usuAvalId: usuAval.id,
            perguntaId: pergunta.id,
            resposta: respostaTexto,
          }
        });
      }
    }

    console.log(`✅ Criado: ${titulo} (${totalRespostas} respostas)`);
  }


  // CRIAR VÁRIOS QUESTIONÁRIOS
  await criarQuestionario({
    titulo: 'Satisfação com o Evento Anual',
    totalRespostas: 50,
    perguntas: [
      {
        enunciado: 'Como você avalia o evento geral?',
        tipo: 'MULTIPLA_ESCOLHA',
        opcoes: ['Excelente', 'Bom', 'Regular', 'Ruim'],
      },
      {
        enunciado: 'O que mais te agradou?',
        tipo: 'TEXTO',
      },
      {
        enunciado: 'Você recomendaria este evento?',
        tipo: 'MULTIPLA_ESCOLHA',
        opcoes: ['Sim', 'Não', 'Talvez'],
      },
    ]
  });


  await criarQuestionario({
    titulo: 'Avaliação Interna dos Funcionários',
    perguntas: [
      {
        enunciado: 'Qual sua satisfação com o ambiente de trabalho?',
        tipo: 'MULTIPLA_ESCOLHA',
        opcoes: ['Muito Satisfeito', 'Satisfeito', 'Insatisfeito'],
      },
      {
        enunciado: 'Você se sente valorizado?',
        tipo: 'MULTIPLA_ESCOLHA',
        opcoes: ['Sim', 'Não'],
      },
      {
        enunciado: 'Sugestões para melhorar o ambiente?',
        tipo: 'TEXTO',
      },
    ]
  });

  await criarQuestionario({
    titulo: 'Feedback dos Pacientes',
    perguntas: [
      {
        enunciado: 'Como você avalia o atendimento recebido?',
        tipo: 'MULTIPLA_ESCOLHA',
        opcoes: ['Ótimo', 'Bom', 'Regular', 'Ruim'],
      },
      {
        enunciado: 'Houve demora no atendimento?',
        tipo: 'MULTIPLA_ESCOLHA',
        opcoes: ['Sim', 'Não'],
      },
      {
        enunciado: 'Comentários adicionais:',
        tipo: 'TEXTO',
      },
    ]
  });

  console.log('🌟 Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('💥 Ocorreu um erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
