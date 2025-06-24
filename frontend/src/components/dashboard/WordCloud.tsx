// frontend/src/components/dashboard/WordCloud.tsx
'use client';
import ReactWordcloud from 'react-wordcloud';
import { ChartContainer } from './ChartContainer';

interface WordCloudProps {
    words: { text: string; value: number }[];
}

const options = {
    rotations: 2,
    rotationAngles: [-90, 0] as [number, number],
    fontSizes: [15, 60] as [number, number],
    padding: 1,
};

export const WordCloud = ({ words }: WordCloudProps) => {
    if (words.length === 0) {
        return (
            <ChartContainer title="Nuvem de Palavras">
                <div className="flex items-center justify-center h-full text-text-muted">
                    Nenhum dado de texto para exibir.
                </div>
            </ChartContainer>
        );
    }

    return (
        <ChartContainer title="Nuvem de Palavras">
            <ReactWordcloud words={words} options={options} />
        </ChartContainer>
    );
};