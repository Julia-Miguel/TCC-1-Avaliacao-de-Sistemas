// frontend/src/components/dashboard/GenericChartContainer.tsx
'use client';
import { ReactNode } from 'react';

interface GenericChartContainerProps {
  title: string;
  children: ReactNode;
}

export const GenericChartContainer = ({ title, children }: GenericChartContainerProps) => {
  return (
    <div className="h-full rounded-lg border border-border bg-card-background p-4 shadow-sm dark:bg-gray-800">
      <h3 className="mb-4 text-base font-semibold text-foreground">{title}</h3>
      {/* Esta div garante que o filho tenha um espaço flexível para crescer */}
      <div className="h-[calc(100%-2rem)] w-full">
        {children}
      </div>
    </div>
  );
};