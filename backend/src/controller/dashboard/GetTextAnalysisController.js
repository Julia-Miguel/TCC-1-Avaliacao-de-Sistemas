import { prisma } from '../../database/client.js';
import { stopwords } from '../../utils/stopwords_pt.js';
import Sentiment from 'sentiment';
import ptbr from 'sentiment-ptbr';

const sentiment = new Sentiment();

export class GetTextAnalysisController {
    async handle(request, response) {
        const { empresaId } = request.user;
        const { perguntaId, questionarioId, semestre } = request.query;

        // Validação de parâmetros de entrada
        if (!perguntaId || !questionarioId) {
            return response.status(400).json({ message: "Os IDs da pergunta e do questionário são obrigatórios." });
        }
        
        const intQuestionarioId = parseInt(questionarioId);
        const intPerguntaId = parseInt(perguntaId);
        const intEmpresaId = parseInt(empresaId);

        try {
            // Etapa 1: Verifica se o questionário é o de satisfação para definir a estratégia de busca
            const questionario = await prisma.questionario.findUnique({
                where: { id: intQuestionarioId },
                select: { eh_satisfacao: true }
            });

            if (!questionario) {
                return response.status(404).json({ message: "Questionário não encontrado." });
            }

            // Etapa 2: Monta o filtro de busca de forma dinâmica
            const whereClause = {
                perguntaId: intPerguntaId,
                pergunta: { tipos: 'TEXTO' }, // Garante que a pergunta é do tipo texto
                usuAval: {
                    isFinalizado: true, // Apenas respostas de avaliações finalizadas
                    avaliacao: {
                        criador: { empresaId: intEmpresaId } // Garante que a avaliação pertence à empresa
                    }
                }
            };
            
            // Lógica condicional: se NÃO for de satisfação, adiciona o filtro extra
            if (!questionario.eh_satisfacao) {
                whereClause.usuAval.avaliacao.questionarioId = intQuestionarioId;
            }

            // Adiciona o filtro de semestre se ele for especificado
            if (semestre && semestre !== 'todos') {
                whereClause.usuAval.avaliacao.semestre = semestre;
            }

            // Etapa 3: Executa a busca com o filtro montado
            const respostas = await prisma.resposta.findMany({
                where: whereClause,
                select: { resposta: true }
            });

            // Etapa 4: Processa os dados (lógica original, está perfeita)
            if (respostas.length === 0) {
                return response.json({
                    wordCloud: [],
                    sentimento: { positive: 0, negative: 0, neutral: 0 }
                });
            }

            const wordFrequencies = {};
            for (const item of respostas) {
                const words = item.resposta.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ").split(/\s+/);
                for (const word of words) {
                    if (word && !stopwords.has(word) && word.length > 2) {
                        wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
                    }
                }
            }
            const wordCloudData = Object.entries(wordFrequencies).map(([text, value]) => ({ text, value })).sort((a, b) => b.value - a.value).slice(0, 100);

            let positiveCount = 0, negativeCount = 0, neutralCount = 0;
            for (const item of respostas) {
                const result = sentiment.analyze(item.resposta, { extras: ptbr });
                if (result.score > 0) positiveCount++;
                else if (result.score < 0) negativeCount++;
                else neutralCount++;
            }
            const totalSentimentos = positiveCount + negativeCount + neutralCount;
            const sentimento = {
                positive: totalSentimentos > 0 ? parseFloat(((positiveCount / totalSentimentos) * 100).toFixed(1)) : 0,
                negative: totalSentimentos > 0 ? parseFloat(((negativeCount / totalSentimentos) * 100).toFixed(1)) : 0,
                neutral: totalSentimentos > 0 ? parseFloat(((neutralCount / totalSentimentos) * 100).toFixed(1)) : 0,
            };

            return response.json({
                wordCloud: wordCloudData,
                sentimento: sentimento
            });

        } catch (error) {
            console.error('[GetTextAnalysisController]', error);
            return response.status(500).json({ message: "Erro ao analisar dados de texto." });
        }
    }
}