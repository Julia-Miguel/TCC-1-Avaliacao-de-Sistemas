// frontend/src/components/dashboard/ChartContainer.tsx
'use client';
import { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
}

export const ChartContainer = ({ title, children }: ChartContainerProps) => (
  <div className="bg-card-bg dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow border border-border">
    <h4 className="text-md font-semibold text-foreground mb-4 truncate" title={title}>{title}</h4>
    <div className="w-full h-72">
      {children}
    </div>
  </div>
);