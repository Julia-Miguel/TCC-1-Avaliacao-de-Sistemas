'use client';

import WordCloud from 'react-d3-cloud';
import { useMemo } from 'react';

// A interface agora usa 'readonly' para seguir as boas práticas
interface WordCloudProps {
  readonly textData: string[];
}

export function WordCloudComponent({ textData }: WordCloudProps) {
    const words = useMemo(() => {
        const frequencyMap: { [key: string]: number } = {};
        textData.forEach(text => {
            const cleanedText = text.toLowerCase().replace(/[.,!?;:]/g, '');
            const wordsInText = cleanedText.split(/\s+/);

            wordsInText.forEach(word => {
                if (word.length > 3) {
                    frequencyMap[word] = (frequencyMap[word] || 0) + 1;
                }
            });
        });
        return Object.entries(frequencyMap).map(([text, value]) => ({ text, value }));
    }, [textData]);

    if (words.length === 0) {
        return <div className="text-center text-text-muted p-4">Não há respostas de texto para exibir.</div>;
    }

    // Função para determinar o tamanho da fonte com base na frequência
    const fontSizeMapper = (word: { value: number }) => Math.log2(word.value) * 5 + 16;
    
    // Função para determinar a rotação (aleatório entre -90 e 0 graus)
    const rotate = () => (Math.random() > 0.5 ? 0 : -90);

    return (
        <div style={{ height: 300, width: '100%' }}>
            {/* As opções agora são passadas como propriedades individuais */}
            <WordCloud
                data={words}
                fontSize={fontSizeMapper}
                rotate={rotate}
                padding={2}
            />
        </div>
    );
}