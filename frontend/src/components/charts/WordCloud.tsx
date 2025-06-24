// src/components/charts/WordCloud.tsx
'use client';

import WordCloud from 'react-wordcloud';
import { useMemo } from 'react';

interface WordCloudProps {
  textData: string[];
}

// Opções de customização da nuvem de palavras
const options = {
  rotations: 2,
  rotationAngles: [-90, 0] as [number, number],
  fontSizes: [12, 60] as [number, number],
  padding: 2,
};

export function WordCloudComponent({ textData }: WordCloudProps) {
    // Processa o texto para contar a frequência de cada palavra
    const words = useMemo(() => {
        const frequencyMap: { [key: string]: number } = {};
        textData.forEach(text => {
            // Separa as palavras, remove pontuação e palavras pequenas
            const cleanedText = text.toLowerCase().replace(/[.,!?;:]/g, '');
            const wordsInText = cleanedText.split(/\s+/);

            wordsInText.forEach(word => {
                if (word.length > 3) { // Ignora palavras muito curtas
                    frequencyMap[word] = (frequencyMap[word] || 0) + 1;
                }
            });
        });

        return Object.entries(frequencyMap).map(([text, value]) => ({ text, value }));
    }, [textData]);

    if (words.length === 0) {
        return <div className="text-center text-text-muted p-4">Não há respostas de texto para exibir.</div>;
    }

    return (
        <div style={{ height: 300, width: '100%' }}>
            <WordCloud words={words} options={options} />
        </div>
    );
}