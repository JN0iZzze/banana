import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PresentationShell } from '../../presentation/components/PresentationShell';
import { toDeckDefinition } from '../adapters/toDeckDefinition';
import { useRepositories } from '../data/repositoryContext';
import type { CreatorDeck } from '../domain/types';

export function CreatorPresentPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const repositories = useRepositories();

  const [deck, setDeck] = useState<CreatorDeck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!deckId) {
      setError('Не указан идентификатор деки');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    repositories.decks
      .loadDeck(deckId)
      .then((loaded) => {
        if (cancelled) return;
        if (!loaded) {
          setError('Дека не найдена');
        } else {
          setDeck(loaded);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Не удалось загрузить деку');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [deckId, repositories]);

  const deckDefinition = useMemo(() => (deck ? toDeckDefinition(deck) : null), [deck]);

  const invalidCount = useMemo(
    () => (deck ? deck.slides.filter((s) => s.validation.status === 'invalid').length : 0),
    [deck],
  );
  const hiddenCount = useMemo(
    () => (deck ? deck.slides.filter((s) => s.hidden).length : 0),
    [deck],
  );

  useEffect(() => {
    if (invalidCount > 0) {
      setBannerVisible(true);
      const t = window.setTimeout(() => setBannerVisible(false), 3000);
      return () => window.clearTimeout(t);
    }
    return;
  }, [invalidCount]);

  const editorHref = deckId ? `/creator/decks/${deckId}` : '/creator';

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#060606] text-white">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">Загрузка…</p>
          <Link to={editorHref} className="inline-block text-sm text-sky-400 hover:text-sky-300">
            ← К редактору
          </Link>
        </div>
      </div>
    );
  }

  if (error || !deck || !deckDefinition) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#060606] text-white">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">
            {error ?? 'Дека недоступна'}
          </p>
          <Link to={editorHref} className="inline-block text-sm text-sky-400 hover:text-sky-300">
            ← К редактору
          </Link>
        </div>
      </div>
    );
  }

  if (deckDefinition.slides.length === 0) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#060606] text-white">
        <div className="max-w-md space-y-4 text-center">
          <p className="text-lg font-semibold">Пока нечего показывать</p>
          <p className="text-sm text-white/60">
            В деке нет слайдов, доступных для просмотра
            {hiddenCount > 0 || invalidCount > 0
              ? ` (скрыто: ${hiddenCount}, с ошибками: ${invalidCount})`
              : ''}
            .
          </p>
          <Link to={editorHref} className="inline-block text-sm text-sky-400 hover:text-sky-300">
            ← К редактору
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <PresentationShell deck={deckDefinition} />

      <button
        type="button"
        onClick={() => navigate(editorHref)}
        className="fixed right-4 top-4 z-20 rounded-md border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/60"
        aria-label="Закрыть просмотр"
      >
        × Закрыть
      </button>

      {bannerVisible ? (
        <div className="pointer-events-none fixed left-1/2 top-4 z-20 -translate-x-1/2 rounded-md border border-amber-400/40 bg-amber-500/20 px-4 py-2 text-xs font-medium text-amber-100 backdrop-blur-md">
          Пропущено {invalidCount}{' '}
          {pluralizeSlides(invalidCount)} из-за ошибок валидации
        </div>
      ) : null}
    </div>
  );
}

function pluralizeSlides(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'слайд';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'слайда';
  return 'слайдов';
}
