// frontend/src/components/dashboard/WordCloud.tsx
'use client';

import { useEffect, useState } from 'react';
import cloud from 'd3-cloud';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { ChartContainer } from './ChartContainer'; // Vamos usar o container!

// Interfaces (não mudam)
interface WordData {
    text: string;
    value: number;
}
interface ProcessedWord extends cloud.Word {
    text: string;
    value: number;
    font?: string;
    style?: string;
    weight?: string | number;
    rotate?: number;
    size?: number;
    padding?: number;
    x?: number;
    y?: number;
}
interface WordCloudProps {
    words: WordData[];
    title: string;
}

const colorScale = scaleOrdinal(schemeCategory10);

export const WordCloud = ({ words, title }: WordCloudProps) => {
    const [layoutWords, setLayoutWords] = useState<ProcessedWord[]>([]);
    
    useEffect(() => {
        if (!words || words.length === 0) {
            setLayoutWords([]);
            return;
        }

        const layout = cloud()
            .size([500, 280]) // Ajuste o tamanho para caber no container
            .words(words.map(d => ({ ...d })))
            .padding(5)
            .rotate(() => 0) // Palavras na horizontal para melhor leitura
            .font('Inter, sans-serif')
            .fontSize(d => Math.sqrt((d as WordData).value) * 6 + 12)
            .on('end', setLayoutWords);

        layout.start();
    }, [words]);

    return (
        // Envolvemos tudo no ChartContainer
        <ChartContainer title={title}>
            {layoutWords.length === 0 ? (
                <div className="flex items-center justify-center h-full text-text-muted">
                    <p>Processando ou sem dados para exibir...</p>
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 500 280">
                        <g transform={`translate(250, 140)`}>
                            {layoutWords.map((word, i) => (
                                <text
                                    key={word.text || i}
                                    textAnchor="middle"
                                    transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
                                    style={{
                                        fontSize: word.size,
                                        fontFamily: word.font,
                                        fill: colorScale(i.toString()) as string,
                                    }}
                                >
                                    {word.text}
                                </text>
                            ))}
                        </g>
                    </svg>
                </div>
            )}
        </ChartContainer>
    );
};