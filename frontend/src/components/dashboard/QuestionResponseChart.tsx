// frontend/src/components/dashboard/QuestionResponseChart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  count: number;
}

interface QuestionResponseChartProps {
  title: string;
  data: ChartData[];
}

export function QuestionResponseChart({ title, data }: QuestionResponseChartProps) {
  return (
    <div className="bg-card-background dark:bg-gray-800 p-6 rounded-lg shadow border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip
              cursor={{ fill: 'rgba(var(--color-primary-rgb), 0.1)' }}
              contentStyle={{
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Legend />
            <Bar dataKey="count" name="Respostas" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}