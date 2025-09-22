import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonBlockProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
  lines?: number;
  height?: string;
  width?: string;
}

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  className,
  variant = 'default',
  lines = 1,
  height,
  width
}) => {
  const baseClasses = 'animate-pulse bg-muted rounded';

  const variants = {
    default: 'h-4 w-full',
    card: 'h-48 w-full rounded-lg',
    text: 'h-4 w-full',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded-md'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variants.text,
              i === lines - 1 && 'w-3/4' // Last line is shorter
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        height && `h-[${height}]`,
        width && `w-[${width}]`,
        className
      )}
    />
  );
};

// Convenience components for common use cases
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-3', className)}>
    <SkeletonBlock variant="card" />
    <div className="space-y-2">
      <SkeletonBlock variant="text" />
      <SkeletonBlock variant="text" lines={2} />
    </div>
  </div>
);

export const SkeletonProductGrid: React.FC<{ items?: number; className?: string }> = ({ 
  items = 6, 
  className 
}) => (
  <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
