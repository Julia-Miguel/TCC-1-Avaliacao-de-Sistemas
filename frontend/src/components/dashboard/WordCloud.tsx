// frontend/src/components/dashboard/WordCloud.tsx
'use client';

import dynamic from 'next/dynamic';
// A importação dinâmica continua sendo a melhor prática para componentes de visualização
const WordCloudComponent = dynamic(() => import('react-d3-cloud'), {
  ssr: false, // Garantimos que ele só rode no navegador
});

interface WordCloudProps {
  words?: { text: string; value: number }[] | null;
}

// A nova biblioteca pede uma função para mapear o tamanho da fonte
const fontSizeMapper = (word: { value: number }) => Math.log2(word.value) * 5 + 16;

export const WordCloud = ({ words }: WordCloudProps) => {
  if (!words || words.length === 0) {
    return (
      <GenericChartContainer title="Nuvem de Palavras">
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-text-muted">Selecione uma pergunta para analisar ou não há dados.</p>
        </div>
      </GenericChartContainer>
    );
  }

  return (
    <GenericChartContainer title="Nuvem de Palavras">
        <WordCloudComponent
            data={words}
            font="sans-serif"
            fontSize={fontSizeMapper}
            padding={2}
            // A nova biblioteca não precisa de 'options' separadas
        />
    </GenericChartContainer>
  );
};