import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, Check, Eye, Images } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { EditorProvider, useEditorStore } from '../editor/editorStore';
import { SlideList } from '../editor/SlideList';
import { InspectorPanel } from '../editor/inspector/InspectorPanel';
import { AssetLibrary } from '../editor/assets/AssetLibrary';
import { SlidePreview } from '../preview/SlidePreview';
import { Alert } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Toaster } from '../ui/sonner';

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

  // Ошибки рантайма редактора показываем тостами, а не баннером.
  useEffect(() => {
    if (!error || !deck) return;
    toast.error(error);
    store.clearError();
  }, [error, deck, store]);

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
    return (
      <EditorPageFallbackChrome>
        <p className="text-neutral-400">Загрузка деки…</p>
      </EditorPageFallbackChrome>
    );
  }

  if (error && !deck) {
    return (
      <EditorPageFallbackChrome>
        <div className="space-y-3">
          <Alert variant="destructive" className="p-4 text-sm">
            Не удалось загрузить деку: {error}
          </Alert>
          <Link
            to="/creator"
            className="inline-flex items-center gap-1.5 text-sm text-sky-400 hover:text-sky-300"
          >
            <ArrowLeft className="size-4" />
            К списку дек
          </Link>
        </div>
      </EditorPageFallbackChrome>
    );
  }

  if (!deck) {
    return (
      <EditorPageFallbackChrome>
        <div className="space-y-3">
          <p className="text-neutral-400">Дека не найдена.</p>
          <Link
            to="/creator"
            className="inline-flex items-center gap-1.5 text-sm text-sky-400 hover:text-sky-300"
          >
            <ArrowLeft className="size-4" />
            К списку дек
          </Link>
        </div>
      </EditorPageFallbackChrome>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <EditorHeader
        assetsOpen={assetsOpen}
        onToggleAssets={() => setAssetsOpen((v) => !v)}
      />
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
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}

function EditorPageFallbackChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-800 bg-neutral-900/60 px-6 py-3">
        <Link
          to="/creator"
          className="inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          title="К списку дек"
          aria-label="К списку дек"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <Link to="/" className="shrink-0 text-sm text-neutral-400 hover:text-neutral-100">
          К презентациям
        </Link>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">{children}</div>
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
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link
          to="/creator"
          className="inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          title="К списку дек"
          aria-label="К списку дек"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {editing ? (
            <Input
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
              size="sm"
              className="min-w-0 flex-1 border-neutral-700 text-lg font-semibold"
            />
          ) : (
            <button
              type="button"
              onClick={startEdit}
              className="min-w-0 flex-1 truncate text-left text-lg font-semibold text-neutral-50 hover:text-white"
              title="Переименовать"
            >
              {deck.title}
            </button>
          )}
          <span className="shrink-0 rounded-full border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300">
            {deck.status}
          </span>
          <SlideValidityBadge />

          {store.isSaving ? (
            <span className="shrink-0 text-xs text-neutral-500">Сохраняем…</span>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleAssets}
          className={
            assetsOpen ? 'border-sky-600 bg-sky-950/40 text-sky-100 hover:bg-sky-950/50' : undefined
          }
        >
          <Images />
          Ассеты ({store.assets.length})
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate(`/creator/decks/${deck.id}/present`)}
        >
          <Eye />
          Просмотр
        </Button>
        <Button variant="outline" size="sm" className="text-neutral-400" asChild>
          <Link to="/">К презентациям</Link>
        </Button>
      </div>
    </header>
  );
}

function SlideValidityBadge() {
  const store = useEditorStore();
  const { deck, selectedSlideId } = store;

  const status = useMemo(() => {
    if (!deck || !selectedSlideId) return null;
    const slide = deck.slides.find((s) => s.id === selectedSlideId);
    return slide?.validation.status ?? null;
  }, [deck, selectedSlideId]);

  if (status === null) return null;

  if (status === 'valid') {
    return (
      <Badge
        variant="outline"
        className="border-emerald-900/60 bg-emerald-950/40 text-emerald-300"
      >
        <Check />
        Валиден
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-red-900/60 bg-red-950/40 text-red-300"
    >
      <AlertCircle />
      Ошибка
    </Badge>
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

