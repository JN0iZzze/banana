import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from './cn';

export type SlideCodeWindowProps = PropsWithChildren<{
  /** Заголовок полосы окна, например имя файла */
  title: string;
  /** Дополнительные классы корневого контейнера */
  className?: string;
  /** Область под шапкой: по умолчанию внутренние отступы как у карточки слайда */
  bodyClassName?: string;
  /** Кастомное содержимое шапки справа вместо трёх «светофорных» точек */
  headerTrailing?: ReactNode;
}>;

/**
 * Псевдо-окно редактора: рамка, инвертированная шапка с именем файла и декором в стиле macOS.
 * Цвета берутся из токенов темы слайда (`--slide-color-*`).
 */
export function SlideCodeWindow({
  title,
  children,
  className,
  bodyClassName,
  headerTrailing,
}: SlideCodeWindowProps) {
  return (
    <div
      className={cn(
        'flex min-h-0 w-full flex-col overflow-hidden rounded-[var(--slide-radius-panel)] border-2 border-[color:var(--slide-color-text)] bg-[color:var(--slide-color-surface)]/50 backdrop-blur-sm',
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-4 bg-[color:var(--slide-color-text)] px-6 py-3 font-mono text-[1.5rem] leading-none text-[color:var(--slide-color-bg)]">
        <span className="min-w-0 truncate">{title}</span>
        {headerTrailing ?? (
          <div className="flex shrink-0 gap-2" aria-hidden="true">
            <div className="h-4 w-4 rounded-full bg-[color:var(--slide-color-bg)] opacity-50" />
            <div className="h-4 w-4 rounded-full bg-[color:var(--slide-color-bg)] opacity-50" />
            <div className="h-4 w-4 rounded-full bg-[color:var(--slide-color-bg)] opacity-50" />
          </div>
        )}
      </div>
      <div className={cn('min-h-0 flex-1 overflow-auto p-12', bodyClassName)}>{children}</div>
    </div>
  );
}
