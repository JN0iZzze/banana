import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EditorProvider, useEditorStore } from '../editor/editorStore';
import { SlideList } from '../editor/SlideList';
import { InspectorPanel } from '../editor/inspector/InspectorPanel';
import { AssetLibrary } from '../editor/assets/AssetLibrary';
import { SlidePreview } from '../preview/SlidePreview';

export function CreatorDeckEditorPage() {
  return (
    <EditorProvider>
      <EditorPageInner />
    </EditorProvider>
  );
}

function EditorPageInner() {
  const { deckId, slideId } = useParams<{ deckId: string; slideId?: string }>();
  const navigate = useNavigate();
  const store = useEditorStore();
  const { loadDeck, setSelectedSlideId, selectedSlideId, deck, isLoading, error, flushPendingDocuments } = store;
  const [assetsOpen, setAssetsOpen] = useState(false);

  // Flush debounced doc-changes при уходе со страницы редактора.
  useEffect(() => {
    return () => {
      void flushPendingDocuments();
    };
  }, [flushPendingDocuments]);

  // Flush при переключении выбранного слайда (чтобы правки предыдущего ушли в БД).
  const prevSelectedRef = useRef<string | null>(null);
  useEffect(() => {
    if (prevSelectedRef.current && prevSelectedRef.current !== selectedSlideId) {
      void flushPendingDocuments();
    }
    prevSelectedRef.current = selectedSlideId;
  }, [selectedSlideId, flushPendingDocuments]);

  // Загрузка деки при монтировании / смене deckId.
  useEffect(() => {
    if (!deckId) return;
    void loadDeck(deckId);
  }, [deckId, loadDeck]);

  // Синхронизация slideId из URL → state (когда дека загружена).
  const syncedFromUrlRef = useRef<string | null>(null);
  useEffect(() => {
    if (!deck) return;
    if (slideId && syncedFromUrlRef.current !== slideId) {
      const exists = deck.slides.some((s) => s.id === slideId);
      if (exists) {
        setSelectedSlideId(slideId);
        syncedFromUrlRef.current = slideId;
      }
    }
  }, [deck, slideId, setSelectedSlideId]);

  // Авто-select первого слайда, если дека загружена и ничего не выбрано.
  useEffect(() => {
    if (!deck || selectedSlideId || slideId) return;
    const sorted = [...deck.slides].sort((a, b) => a.orderIndex - b.orderIndex);
    if (sorted.length > 0) setSelectedSlideId(sorted[0].id);
  }, [deck, selectedSlideId, slideId, setSelectedSlideId]);

  // Если выбранный слайд исчез (удалили) — перейти на соседний.
  useEffect(() => {
    if (!deck || !selectedSlideId) return;
    const exists = deck.slides.some((s) => s.id === selectedSlideId);
    if (!exists) {
      const sorted = [...deck.slides].sort((a, b) => a.orderIndex - b.orderIndex);
      setSelectedSlideId(sorted.length > 0 ? sorted[0].id : null);
    }
  }, [deck, selectedSlideId, setSelectedSlideId]);

  // Синхронизация state → URL (deep link).
  useEffect(() => {
    if (!deckId) return;
    if (!selectedSlideId) {
      if (slideId) {
        navigate(`/creator/decks/${deckId}`, { replace: true });
      }
      return;
    }
    if (selectedSlideId !== slideId) {
      navigate(`/creator/decks/${deckId}/slides/${selectedSlideId}`, { replace: true });
    }
  }, [selectedSlideId, deckId, slideId, navigate]);

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedSlideId(id);
    },
    [setSelectedSlideId],
  );

  if (isLoading && !deck) {
    return <p className="text-neutral-400">Загрузка деки…</p>;
  }

  if (error && !deck) {
    return (
      <div className="space-y-3">
        <div className="rounded-md border border-red-900/60 bg-red-950/40 p-4 text-sm text-red-200">
          Не удалось загрузить деку: {error}
        </div>
        <Link to="/creator" className="inline-block text-sm text-sky-400 hover:text-sky-300">
          ← К списку дек
        </Link>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="space-y-3">
        <p className="text-neutral-400">Дека не найдена.</p>
        <Link to="/creator" className="inline-block text-sm text-sky-400 hover:text-sky-300">
          ← К списку дек
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <EditorHeader
        assetsOpen={assetsOpen}
        onToggleAssets={() => setAssetsOpen((v) => !v)}
      />
      {error ? (
        <div className="flex items-center justify-between gap-3 border-b border-red-900/60 bg-red-950/40 px-4 py-2 text-sm text-red-200">
          <span>{error}</span>
          <button
            type="button"
            onClick={store.clearError}
            className="rounded border border-red-900/80 px-2 py-0.5 text-xs text-red-100 hover:bg-red-900/60"
          >
            Скрыть
          </button>
        </div>
      ) : null}
      {assetsOpen ? <AssetLibrary onClose={() => setAssetsOpen(false)} /> : null}
      <div className="grid min-h-0 flex-1 grid-cols-[280px_1fr_360px]">
        <aside className="min-h-0 border-r border-neutral-800 bg-neutral-950/60">
          <SlideList onSelect={handleSelect} />
        </aside>
        <section className="min-h-0 overflow-hidden bg-neutral-950 p-6">
          <PreviewSection />
        </section>
        <aside className="flex min-h-0 flex-col border-l border-neutral-800 bg-neutral-950/60 p-4">
          <InspectorPanel />
        </aside>
      </div>
    </div>
  );
}

interface EditorHeaderProps {
  assetsOpen: boolean;
  onToggleAssets: () => void;
}

function EditorHeader({ assetsOpen, onToggleAssets }: EditorHeaderProps) {
  const store = useEditorStore();
  const navigate = useNavigate();
  const deck = store.deck;
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');

  if (!deck) return null;

  const startEdit = () => {
    setDraftTitle(deck.title);
    setEditing(true);
  };

  const commit = () => {
    const next = draftTitle.trim();
    setEditing(false);
    if (next && next !== deck.title) {
      void store.renameDeck(next);
    }
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-neutral-800 bg-neutral-900/60 px-6 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to="/creator"
          className="shrink-0 text-sm text-neutral-400 hover:text-neutral-100"
          title="К списку дек"
        >
          ←
        </Link>
        {editing ? (
          <input
            autoFocus
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.target as HTMLInputElement).blur();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setEditing(false);
              }
            }}
            className="min-w-0 rounded-md border border-neutral-700 bg-neutral-950 px-2 py-1 text-base text-neutral-50 focus:border-sky-500 focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="truncate text-base font-semibold text-neutral-50 hover:text-white"
            title="Переименовать"
          >
            {deck.title}
          </button>
        )}
        <span className="shrink-0 rounded-full border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300">
          {deck.status}
        </span>
        {store.isSaving ? (
          <span className="shrink-0 text-xs text-neutral-500">Сохраняем…</span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleAssets}
          className={`rounded-md border px-3 py-1.5 text-sm ${
            assetsOpen
              ? 'border-sky-600 bg-sky-950/40 text-sky-100'
              : 'border-neutral-700 text-neutral-100 hover:bg-neutral-800'
          }`}
        >
          Ассеты ({store.assets.length})
        </button>
        <button
          type="button"
          onClick={() => navigate(`/creator/decks/${deck.id}/present`)}
          className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-100 hover:bg-neutral-800"
        >
          Просмотр
        </button>
      </div>
    </header>
  );
}

function PreviewSection() {
  const store = useEditorStore();
  const { deck, selectedSlideId } = store;
  const slide = deck && selectedSlideId
    ? deck.slides.find((s) => s.id === selectedSlideId) ?? null
    : null;
  return <SlidePreview slide={slide} />;
}

