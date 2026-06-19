import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#E5EDE8] mb-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F2937] font-heading">{title}</h1>
        <p className="text-sm text-[#6B7280] max-w-2xl">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
