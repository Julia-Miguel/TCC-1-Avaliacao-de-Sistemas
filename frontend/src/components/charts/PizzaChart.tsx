// src/components/charts/PizzaChart.tsx
'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

// Tipos para os dados do nosso gráfico
interface ChartData {
  name: string;
  value: number;
}

interface PizzaChartProps {
  data: { [key: string]: number };
}

// Cores para as fatias do gráfico. Você pode até pegar das suas variáveis CSS!
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="p-2 bg-element-bg border border-main-border rounded-md shadow-lg">
        <p className="text-text-base">{`${data.name} : ${data.value} (${(data.percent * 100).toFixed(0)}%)`}</p>
      </div>
    );
  }
  return null;
};

export function PizzaChartComponent({ data }: PizzaChartProps) {
  // Converte o objeto de dados para o formato que a Recharts espera
  const chartData: ChartData[] = useMemo(() => {
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [data]);

  if (chartData.length === 0) {
    return <div className="text-center text-text-muted p-4">Não há respostas para exibir.</div>;
  }

  return (
    // ResponsiveContainer garante que o gráfico se ajuste ao tamanho do container pai
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}