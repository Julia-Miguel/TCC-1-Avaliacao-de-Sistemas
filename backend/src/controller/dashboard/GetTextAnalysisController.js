// ✅ ARQUIVO CORRIGIDO: backend/src/controller/dashboard/GetTextAnalysisController.js
import { prisma } from '../../database/client.js';
import { stopwords } from '../../utils/stopwords_pt.js';
import Sentiment from 'sentiment';
import ptbr from 'sentiment-ptbr';

const sentiment = new Sentiment();

export class GetTextAnalysisController {
    async handle(request, response) {
        const { empresaId } = request.user;
        // 1. Recebe o novo parâmetro 'semestre' da query
        const { perguntaId, questionarioId, semestre } = request.query;

        if (!perguntaId) {
            return response.status(400).json({ message: "O 'perguntaId' é obrigatório." });
        }

        try {
            // 2. Monta a base do filtro que sempre se aplica
            const baseWhere = {
                perguntaId: parseInt(perguntaId),
                pergunta: {
                    tipos: 'TEXTO',
                },
                usuAval: {
                    avaliacao: {
                        criador: {
                            empresaId: parseInt(empresaId)
                        }
                    }
                }
            };

            // Adiciona o filtro de questionarioId se ele for fornecido
            if (questionarioId) {
                baseWhere.usuAval.avaliacao.questionarioId = parseInt(questionarioId);
            }
            
            // 3. Adiciona o filtro de semestre APENAS se ele for fornecido e não for "todos"
            if (semestre && semestre !== 'todos') {
                baseWhere.usuAval.avaliacao.semestre = semestre;
            }

            // A consulta agora usa o 'baseWhere' que pode ou não conter o filtro de semestre
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

            // --- Lógica da Word Cloud e Análise de Sentimento (sem alterações) ---
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

            let positiveCount = 0;
            let negativeCount = 0;
            let neutralCount = 0;

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