// frontend/src/components/dashboard/QuestionBarChart.tsx
'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartContainer } from './ChartContainer';

interface ChartData {
  name: string;
  value: number;
}

interface BarChartProps {
  data: ChartData[];
  title: string;
}

export const QuestionBarChart = ({ data, title }: BarChartProps) => {
  return (
    <ChartContainer title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'rgba(var(--color-primary-rgb), 0.1)' }}
            contentStyle={{
              backgroundColor: 'var(--color-background-element)',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--border-radius-lg)'
            }}
          />
          <Bar dataKey="value" name="Respostas" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};