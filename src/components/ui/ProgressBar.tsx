interface ProgressBarProps {
  value: number;
  variant?: 'default' | 'warning' | 'danger';
  className?: string;
}

const variantClasses = {
  default: 'bg-brand-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

export function ProgressBar({ value, variant = 'default', className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${variantClasses[variant]}`}
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
