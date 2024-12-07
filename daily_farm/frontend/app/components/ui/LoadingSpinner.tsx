import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

export default function LoadingSpinner({ 
  size = 'md', 
  className = '',
  label = '로딩 중...' 
}: LoadingSpinnerProps) {
  return (
    <div 
      className="flex flex-col justify-center items-center gap-2"
      role="status"
      aria-label={label}
    >
      <div
        className={`
          animate-spin
          rounded-full
          border-primary
          border-t-transparent
          motion-reduce:animate-[spin_1.5s_linear_infinite]
          ${sizeClasses[size]}
          ${className}
        `}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
} 