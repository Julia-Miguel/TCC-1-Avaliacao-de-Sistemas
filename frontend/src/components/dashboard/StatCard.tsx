// frontend/src/components/dashboard/StatCard.tsx
'use client';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const StatCard = ({ title, value, icon: Icon, color, bgColor }: StatCardProps) => {
  return (
    <div className="bg-element-bg p-5 rounded-xl shadow-md border border-main-border transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon size={24} className={color} strokeWidth={1.5} />
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-xl md:text-2xl font-semibold text-text-base">{value}</h3>
        <p className="text-sm text-text-muted mt-1 truncate">{title}</p>
      </div>
    </div>
  );
};