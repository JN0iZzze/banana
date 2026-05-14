import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Plus, RotateCw, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRepositories } from '../data/repositoryContext';
import { DEV_USER_ID } from '../constants';
import { SlugConflictError } from '../domain/errors';
import type { CreatorDeckSummary } from '../domain/types';
import { isValidSlug, slugify } from '../domain/slug';
import { Alert } from '../ui/alert';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type ListState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; decks: CreatorDeckSummary[] };

export function CreatorDecksListPage() {
  const { decks: decksRepo } = useRepositories();
  const navigate = useNavigate();
  const [state, setState] = useState<ListState>({ status: 'loading' });
  const [formOpen, setFormOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    decksRepo
      .listDecks()
      .then((decks) => {
        if (!cancelled) setState({ status: 'ready', decks });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
          setState({ status: 'error', message });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [decksRepo, reloadKey]);

  const handleCreated = useCallback(
    (deck: CreatorDeckSummary) => {
      setState((prev) =>
        prev.status === 'ready'
          ? { status: 'ready', decks: [deck, ...prev.decks] }
          : { status: 'ready', decks: [deck] },
      );
      setFormOpen(false);
      navigate(`/creator/decks/${deck.id}`);
    },
    [navigate],
  );

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-50">Мои деки</h1>
        <Button type="button" onClick={() => setFormOpen((v) => !v)}>
          {formOpen ? <X /> : <Plus />}
          {formOpen ? 'Отмена' : 'Новая дека'}
        </Button>
      </header>

      {formOpen ? <NewDeckForm onCreated={handleCreated} onCancel={() => setFormOpen(false)} /> : null}

      {state.status === 'loading' ? (
        <p className="text-neutral-400">Загрузка…</p>
      ) : null}

      {state.status === 'error' ? (
        <div className="space-y-3">
          <Alert variant="destructive" className="p-4">
            Не удалось загрузить деки: {state.message}
          </Alert>
          <Button type="button" variant="destructive" onClick={() => setReloadKey((k) => k + 1)}>
            <RotateCw />
            Повторить
          </Button>
        </div>
      ) : null}

      {state.status === 'ready' ? (
        state.decks.length === 0 ? (
          <p className="text-neutral-400">Пока нет дек. Создай первую.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {state.decks.map((deck) => (
              <li key={deck.id}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/creator/decks/${deck.id}`)}
                  className="flex h-auto min-h-0 w-full flex-col items-stretch justify-start rounded-lg border-neutral-800 bg-neutral-900/60 p-4 text-left font-normal hover:border-neutral-700 hover:bg-neutral-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-medium text-neutral-50">{deck.title}</div>
                      <div className="text-xs text-neutral-500">/{deck.slug}</div>
                    </div>
                    <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300">
                      {deck.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
                    <span>Слайдов: {deck.slideCount}</span>
                    {deck.invalidSlideCount > 0 ? (
                      <span className="text-amber-400">Невалидных: {deck.invalidSlideCount}</span>
                    ) : null}
                    <span>Обновлено: {new Date(deck.updatedAt).toLocaleString('ru')}</span>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </section>
  );
}

interface NewDeckFormProps {
  onCreated: (deck: CreatorDeckSummary) => void;
  onCancel: () => void;
}

function NewDeckForm({ onCreated, onCancel }: NewDeckFormProps) {
  const { decks: decksRepo } = useRepositories();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveSlug = useMemo(() => (slugTouched ? slug : slugify(title)), [slug, slugTouched, title]);

  const titleError = title.trim().length === 0 ? 'Укажи название' : null;
  const slugError = isValidSlug(effectiveSlug)
    ? null
    : 'Slug должен содержать только латиницу, цифры и дефис';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (titleError || slugError) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await decksRepo.createDeck(
        { title: title.trim(), slug: effectiveSlug },
        DEV_USER_ID,
      );
      onCreated(created);
    } catch (err: unknown) {
      if (err instanceof SlugConflictError) {
        setError('Slug уже занят глобально');
      } else {
        setError(err instanceof Error ? err.message : 'Не удалось создать деку');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4"
    >
      <div className="space-y-1">
        <label className="block text-xs uppercase tracking-wide text-neutral-400" htmlFor="deck-title">
          Название
        </label>
        <Input
          id="deck-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например, Вайбкодинг"
          autoFocus
          aria-invalid={!!titleError}
        />
        {titleError ? <p className="text-xs text-amber-400">{titleError}</p> : null}
      </div>

      <div className="space-y-1">
        <label className="block text-xs uppercase tracking-wide text-neutral-400" htmlFor="deck-slug">
          Slug
        </label>
        <Input
          id="deck-slug"
          type="text"
          value={effectiveSlug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="font-mono"
          placeholder="vibecoding"
          aria-invalid={!!slugError}
        />
        {slugError ? <p className="text-xs text-amber-400">{slugError}</p> : null}
      </div>

      {error ? (
        <Alert variant="destructive" className="text-sm">
          {error}
        </Alert>
      ) : null}

      <div className="flex items-center gap-2 pt-1">
        <Button type="submit" disabled={submitting || !!titleError || !!slugError}>
          {submitting ? 'Создаём…' : 'Создать'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
