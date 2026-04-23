import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface CreatorShellProps {
  children: ReactNode;
}

export function CreatorShell({ children }: CreatorShellProps) {
  const location = useLocation();
  // Editor занимает весь экран трёхколоночным layout'ом, остальным страницам
  // оставляем центрированный контейнер.
  const isEditor = /^\/creator\/decks\/[^/]+(\/slides\/[^/]+)?$/.test(location.pathname);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-neutral-950 text-neutral-100">
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-900/60 px-6 py-3">
        <Link
          to="/creator"
          className="text-lg font-semibold tracking-tight text-neutral-50 hover:text-white"
        >
          Creator
        </Link>
        <Link to="/" className="text-sm text-neutral-400 hover:text-neutral-100">
          К презентациям
        </Link>
      </header>
      {isEditor ? (
        <main className="min-h-0 flex-1">{children}</main>
      ) : (
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-6 py-8">{children}</div>
        </main>
      )}
    </div>
  );
}
