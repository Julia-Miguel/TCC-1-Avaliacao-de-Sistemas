// ✅ ARQUIVO CORRIGIDO: frontend/src/components/dashboard/WordCloud.tsx
'use client';

import { useEffect, useState } from 'react';
import cloud from 'd3-cloud';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

// Interfaces (sem alteração)
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
        if (!words || words.length === 0 || !Array.isArray(words)) {
            setLayoutWords([]);
            return;
        }

        const layout = cloud()
            .size([500, 280])
            .words(words)
            .padding(5)
            .rotate(() => 0)
            .font('Inter, sans-serif')
            .fontSize(d => (d as WordData).value * 2 + 12)
            .on('end', (computedWords: ProcessedWord[]) => setLayoutWords(computedWords));

        layout.start();
    }, [words]);

    return (
        <>
            {layoutWords.length === 0 ? (
                <div className="flex items-center justify-center h-full text-text-muted">
                    <p>Processando ou sem dados para exibir...</p>
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 500 280" preserveAspectRatio="xMidYMid meet">
                        <g transform="translate(250, 140)">
                            {layoutWords.map((word, i) => (
                                <text
                                    key={word.text || i}
                                    textAnchor="middle"
                                    transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate || 0})`}
                                    style={{
                                        fontSize: `${word.size}px`,
                                        fontFamily: word.font || 'Inter, sans-serif',
                                        fill: colorScale(i.toString()),
                                        margin: '10px',
                                    }}
                                >
                                    {word.text}
                                </text>
                            ))}
                        </g>
                    </svg>
                </div>
            )}
        </>
    );
};