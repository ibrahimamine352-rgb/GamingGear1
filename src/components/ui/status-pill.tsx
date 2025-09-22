import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusPillProps {
  variant: 'success' | 'error' | 'warning' | 'info' | 'loading';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  success: 'bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
  error: 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20',
  info: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  loading: 'bg-muted text-muted-foreground border-border'
};

const variantIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

export const StatusPill: React.FC<StatusPillProps> = ({
  variant,
  children,
  className,
  size = 'md'
}) => {
  const Icon = variantIcons[variant];
  const isAnimated = variant === 'loading';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <Icon 
        className={cn(
          'h-4 w-4',
          size === 'sm' && 'h-3 w-3',
          size === 'lg' && 'h-5 w-5'
        )}
        {...(isAnimated && { className: 'animate-spin' })}
      />
      {children}
    </div>
  );
};
