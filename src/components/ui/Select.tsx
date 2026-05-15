import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-neutral-800 mb-1">{label}</label>}
      <select
        className={cn(
          'w-full px-3 py-2 border rounded-lg text-sm transition-colors bg-white',
          'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-500',
          error ? 'border-red-500' : 'border-neutral-200',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
