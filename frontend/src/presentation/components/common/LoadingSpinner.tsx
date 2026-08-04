import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  label?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 24,
  label,
  className = 'text-sky-700',
}: LoadingSpinnerProps) {
  return (
    <span className={`inline-flex items-center gap-2 font-medium ${className}`}>
      <Loader2 size={size} className="animate-spin" aria-hidden="true" />
      {label && <span>{label}</span>}
    </span>
  );
}
