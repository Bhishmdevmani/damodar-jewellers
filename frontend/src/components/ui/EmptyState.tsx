import Link from 'next/link';
import { Button } from './Button';
import { LucideIcon, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-[#191713] border border-[rgba(201,164,92,0.25)] flex items-center justify-center mb-6 text-[#C9A45C]">
        <Icon className="w-7 h-7" />
      </div>
      <h3
        className="text-2xl font-light text-[#F5F0E7] mb-3 tracking-wide"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {title}
      </h3>
      <p className="text-sm text-[#A8A197] leading-relaxed mb-8">{description}</p>
      {actionText && (
        actionHref ? (
          <Link href={actionHref}>
            <Button variant="outline">{actionText}</Button>
          </Link>
        ) : onAction ? (
          <Button variant="outline" onClick={onAction}>
            {actionText}
          </Button>
        ) : null
      )}
    </div>
  );
}
