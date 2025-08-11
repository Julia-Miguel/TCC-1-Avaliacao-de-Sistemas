'use client';

import WordCloud from 'react-d3-cloud';
import { useMemo, useRef, useState, useEffect } from 'react';

interface Props {
  readonly textData: string[];
}

export function WordCloudComponent({ textData }: Props) {
  const wordData = useMemo(() => {
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

    const entries = Object.entries(frequencyMap).map(([text, value]) => ({ text, value }));
    if (entries.length === 0) {
      return { words: [], minValue: 0, maxValue: 0 };
    }

    const values = entries.map(w => w.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    return { words: entries, minValue, maxValue };
  }, [textData]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(400);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (wordData.words.length === 0) {
    return <div className="text-center text-text-muted p-4">Não há respostas de texto para exibir.</div>;
  }

  const fontSize = (word: { value: number }) => {
    const { minValue, maxValue } = wordData;
    if (minValue === maxValue) {
      return 36; // Tamanho médio arbitrário
    }
    return 12 + (word.value - minValue) * (60 - 12) / (maxValue - minValue);
  };

  const rotate = () => [-90, 0][Math.floor(Math.random() * 2)];

  const padding = 2;

  return (
    <div ref={containerRef} style={{ height: 300, width: '100%' }}>
      <WordCloud
        data={wordData.words}
        fontSize={fontSize}
        rotate={rotate}
        padding={padding}
        height={300}
        width={width}
      />
    </div>
  );
}