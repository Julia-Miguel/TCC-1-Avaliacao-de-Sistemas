// backend/prisma/seeds.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const EMPRESA_ID = 244; // ID da empresa a ser populada

async function main() {
  console.log('🌱 Iniciando o processo de seeding...');

  // Busca o primeiro usuário dessa empresa (pode ajustar para buscar admin específico)
  const adminUser = await prisma.usuario.findFirst({
    where: { empresaId: EMPRESA_ID },
    include: { empresa: true },
  });

  if (!adminUser) {
    console.error(`❌ Nenhum usuário encontrado para a empresa ID ${EMPRESA_ID}.`);
    process.exit(1);
  }

  const empresaId = adminUser.empresaId;

  console.log(`🏢 Populando dados para a empresa ID ${empresaId} (${adminUser.empresa.nome})`);

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
          opcoes: true,
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

  // CRIAR QUESTIONÁRIOS
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
