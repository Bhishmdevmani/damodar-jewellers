import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
      <div className="w-14 h-14 rounded-full bg-red-950/20 border border-red-500/30 flex items-center justify-center mb-5 text-red-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3
        className="text-xl font-light text-[#F5F0E7] mb-2"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {title}
      </h3>
      <p className="text-xs text-[#A8A197] leading-relaxed mb-6">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RotateCcw className="w-3.5 h-3.5" />
          Try Again
        </Button>
      )}
    </div>
  );
}
