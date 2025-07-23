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
    <div className="bg-element-bg p-5 rounded-xl shadow-md border border-main-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted mb-1 truncate">{title}</p>
          <p className="text-2xl font-bold text-text-base">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon size={24} className={color} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};