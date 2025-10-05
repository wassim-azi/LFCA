import React from 'react';

interface QuizProgressProps {
  current: number;
  total: number;
  className?: string;
}

export const QuizProgress = ({ current, total, className = '' }: QuizProgressProps) => {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={`w-full max-w-4xl ${className}`} aria-hidden>
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Progress</span>
        <span className="text-xs font-semibold text-foreground">{current}/{total} • {percent}%</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 shadow-sm transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default QuizProgress;
