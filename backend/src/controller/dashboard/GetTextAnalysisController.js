// backend/src/controller/dashboard/GetTextAnalysisController.js
import { prisma } from '../../database/client.js';
import { stopwords } from '../../utils/stopwords_pt.js';
import Sentiment from 'sentiment';
import ptbr from 'sentiment-ptbr'; // O vocabulário em português

// A instância do Sentiment é criada sem registrar a linguagem aqui.
const sentiment = new Sentiment();

export class GetTextAnalysisController {
    async handle(request, response) {
        const { empresaId } = request.user;
        const { perguntaId, questionarioId } = request.query;

        if (!perguntaId) {
            return response.status(400).json({ message: "O 'perguntaId' é obrigatório." });
        }

        try {
            const baseWhere = {
                perguntaId: parseInt(perguntaId),
                pergunta: {
                    tipos: 'TEXTO',
                },
                usuAval: {
                    avaliacao: {
                        questionario: {
                            criador: {
                                empresaId: parseInt(empresaId)
                            }
                        }
                    }
                }
            };

            if (questionarioId) {
                baseWhere.usuAval.avaliacao.questionarioId = parseInt(questionarioId);
            }

            const respostas = await prisma.resposta.findMany({
                where: baseWhere,
                select: {
                    resposta: true
                }
            });

            if (respostas.length === 0) {
                return response.json({
                    wordCloud: [],
                    sentimento: { positive: 0, negative: 0, neutral: 0 }
                });
            }

            // --- Lógica da Word Cloud (sem alteração) ---
            const wordFrequencies = {};
            for (const item of respostas) {
                const words = item.resposta
                    .toLowerCase()
                    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                    .replace(/\s{2,}/g, " ")
                    .split(/\s+/);
                
                for (const word of words) {
                    if (word && !stopwords.has(word) && word.length > 2) {
                        wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
                    }
                }
            }
            const wordCloudData = Object.entries(wordFrequencies)
                .map(([text, value]) => ({ text, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 100);

            // --- Lógica da Análise de Sentimento (CORRIGIDA) ---
            let positiveCount = 0;
            let negativeCount = 0;
            let neutralCount = 0;

            for (const item of respostas) {
                // A correção está aqui: passamos o vocabulário 'ptbr' na opção 'extras'.
                // Isso adiciona as palavras em português à análise sem quebrar a inicialização.
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