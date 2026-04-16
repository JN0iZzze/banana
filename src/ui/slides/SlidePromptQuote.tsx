import type { PropsWithChildren } from 'react';
import { cn } from './cn';

interface SlidePromptQuoteProps extends PropsWithChildren {
  className?: string;
}

export function SlidePromptQuote({ children, className }: SlidePromptQuoteProps) {
  return (
    <div className={cn('border-l-4 border-[color:var(--slide-color-accent)] pl-6', className)}>
      <pre className="whitespace-pre-wrap font-mono text-2xl leading-snug text-[color:var(--slide-color-text)]">
        {children}
      </pre>
    </div>
  );
}
