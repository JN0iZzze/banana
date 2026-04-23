import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
// Используем useReducer + Context, а не Zustand: это MVP, доп. зависимости не
// нужны. Если reducer-подход начнёт тормозить на больших деках, можно будет
// переехать на Zustand без изменений публичного API стора.
import { useRepositories } from '../data/repositoryContext';
import { DEV_USER_ID, SLIDE_DOCUMENT_PERSIST_DEBOUNCE_MS } from '../constants';
import {
  createEmptySlideDocument,
  validateSlideDocument,
} from '../validation/validateSlideDocument';
import type { CreatorAsset, CreatorDeck, CreatorSlide } from '../domain/types';
import type { UpdateSlideMetaPatch } from '../domain/commands';

export interface EditorState {
  deck: CreatorDeck | null;
  selectedSlideId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  assets: CreatorAsset[];
  isAssetsLoading: boolean;
  assetsError: string | null;
}

type EditorAction =
  | { type: 'setLoading'; value: boolean }
  | { type: 'setSaving'; value: boolean }
  | { type: 'setDeck'; deck: CreatorDeck | null }
  | { type: 'setError'; error: string | null }
  | { type: 'setSelectedSlideId'; slideId: string | null }
  | { type: 'replaceSlide'; slide: CreatorSlide }
  | { type: 'addSlide'; slide: CreatorSlide }
  | { type: 'removeSlide'; slideId: string }
  | { type: 'reorderSlides'; orderedIds: string[] }
  | { type: 'patchDeck'; patch: Partial<CreatorDeck> }
  | { type: 'setAssets'; assets: CreatorAsset[] }
  | { type: 'addAsset'; asset: CreatorAsset }
  | { type: 'removeAsset'; assetId: string }
  | { type: 'setAssetsLoading'; value: boolean }
  | { type: 'setAssetsError'; error: string | null };

const initialState: EditorState = {
  deck: null,
  selectedSlideId: null,
  isLoading: false,
  isSaving: false,
  error: null,
  assets: [],
  isAssetsLoading: false,
  assetsError: null,
};

function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'setLoading':
      return { ...state, isLoading: action.value };
    case 'setSaving':
      return { ...state, isSaving: action.value };
    case 'setDeck':
      return { ...state, deck: action.deck };
    case 'setError':
      return { ...state, error: action.error };
    case 'setSelectedSlideId':
      return { ...state, selectedSlideId: action.slideId };
    case 'replaceSlide': {
      if (!state.deck) return state;
      const slides = state.deck.slides.map((s) => (s.id === action.slide.id ? action.slide : s));
      return { ...state, deck: { ...state.deck, slides } };
    }
    case 'addSlide': {
      if (!state.deck) return state;
      const slides = [...state.deck.slides, action.slide].sort(
        (a, b) => a.orderIndex - b.orderIndex,
      );
      return { ...state, deck: { ...state.deck, slides } };
    }
    case 'removeSlide': {
      if (!state.deck) return state;
      const slides = state.deck.slides.filter((s) => s.id !== action.slideId);
      return { ...state, deck: { ...state.deck, slides } };
    }
    case 'reorderSlides': {
      if (!state.deck) return state;
      const map = new Map(state.deck.slides.map((s) => [s.id, s]));
      const slides: CreatorSlide[] = [];
      action.orderedIds.forEach((id, idx) => {
        const s = map.get(id);
        if (s) slides.push({ ...s, orderIndex: idx });
      });
      return { ...state, deck: { ...state.deck, slides } };
    }
    case 'patchDeck': {
      if (!state.deck) return state;
      return { ...state, deck: { ...state.deck, ...action.patch } };
    }
    case 'setAssets':
      return { ...state, assets: action.assets };
    case 'addAsset':
      return { ...state, assets: [action.asset, ...state.assets] };
    case 'removeAsset':
      return { ...state, assets: state.assets.filter((a) => a.id !== action.assetId) };
    case 'setAssetsLoading':
      return { ...state, isAssetsLoading: action.value };
    case 'setAssetsError':
      return { ...state, assetsError: action.error };
    default:
      return state;
  }
}

export interface EditorStore extends EditorState {
  loadDeck: (deckId: string) => Promise<void>;
  setSelectedSlideId: (slideId: string | null) => void;
  createSlide: () => Promise<CreatorSlide | null>;
  deleteSlide: (slideId: string) => Promise<void>;
  duplicateSlide: (slideId: string) => Promise<CreatorSlide | null>;
  moveSlideUp: (slideId: string) => Promise<void>;
  moveSlideDown: (slideId: string) => Promise<void>;
  renameDeck: (title: string) => Promise<void>;
  setSlideHidden: (slideId: string, hidden: boolean) => Promise<void>;
  updateSlideMeta: (
    slideId: string,
    patch: Pick<UpdateSlideMetaPatch, 'title' | 'speakerNotes'>,
  ) => Promise<void>;
  updateSlideDocument: (slideId: string, document: unknown) => void;
  flushPendingDocuments: () => Promise<void>;
  clearError: () => void;
  loadAssets: (deckId: string) => Promise<void>;
  uploadAsset: (file: File) => Promise<CreatorAsset | null>;
  deleteAsset: (assetId: string) => Promise<void>;
}

const StoreCtx = createContext<EditorStore | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const { decks: decksRepo, slides: slidesRepo, assets: assetsRepo } = useRepositories();
  const [state, dispatch] = useReducer(reducer, initialState);

  const errorMessage = (err: unknown): string =>
    err instanceof Error ? err.message : 'Неизвестная ошибка';

  const reload = useCallback(
    async (deckId: string) => {
      try {
        const fresh = await decksRepo.loadDeck(deckId);
        dispatch({ type: 'setDeck', deck: fresh });
      } catch (err) {
        dispatch({ type: 'setError', error: errorMessage(err) });
      }
    },
    [decksRepo],
  );

  const loadAssets = useCallback(
    async (deckId: string) => {
      dispatch({ type: 'setAssetsLoading', value: true });
      dispatch({ type: 'setAssetsError', error: null });
      try {
        const list = await assetsRepo.listAssets(deckId);
        dispatch({ type: 'setAssets', assets: list });
      } catch (err) {
        dispatch({ type: 'setAssetsError', error: errorMessage(err) });
      } finally {
        dispatch({ type: 'setAssetsLoading', value: false });
      }
    },
    [assetsRepo],
  );

  const loadDeck = useCallback(
    async (deckId: string) => {
      dispatch({ type: 'setLoading', value: true });
      dispatch({ type: 'setError', error: null });
      try {
        const deck = await decksRepo.loadDeck(deckId);
        dispatch({ type: 'setDeck', deck });
        void loadAssets(deck.id);
      } catch (err) {
        dispatch({ type: 'setDeck', deck: null });
        dispatch({ type: 'setError', error: errorMessage(err) });
      } finally {
        dispatch({ type: 'setLoading', value: false });
      }
    },
    [decksRepo, loadAssets],
  );

  const uploadAsset = useCallback(
    async (file: File): Promise<CreatorAsset | null> => {
      if (!state.deck) return null;
      const deckId = state.deck.id;
      dispatch({ type: 'setAssetsError', error: null });
      try {
        const asset = await assetsRepo.uploadAndCreate(file, { deckId });
        dispatch({ type: 'addAsset', asset });
        return asset;
      } catch (err) {
        dispatch({ type: 'setAssetsError', error: errorMessage(err) });
        return null;
      }
    },
    [assetsRepo, state.deck],
  );

  const deleteAsset = useCallback(
    async (assetId: string) => {
      if (!state.deck) return;
      const deckId = state.deck.id;
      dispatch({ type: 'removeAsset', assetId });
      try {
        await assetsRepo.deleteAsset(assetId);
      } catch (err) {
        dispatch({ type: 'setAssetsError', error: errorMessage(err) });
        await loadAssets(deckId);
      }
    },
    [assetsRepo, loadAssets, state.deck],
  );

  const setSelectedSlideId = useCallback((slideId: string | null) => {
    dispatch({ type: 'setSelectedSlideId', slideId });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'setError', error: null });
  }, []);

  const createSlide = useCallback(async (): Promise<CreatorSlide | null> => {
    if (!state.deck) return null;
    const deckId = state.deck.id;
    dispatch({ type: 'setSaving', value: true });
    try {
      const slide = await slidesRepo.createSlide(
        deckId,
        { document: createEmptySlideDocument() },
        DEV_USER_ID,
      );
      dispatch({ type: 'addSlide', slide });
      dispatch({ type: 'setSelectedSlideId', slideId: slide.id });
      return slide;
    } catch (err) {
      dispatch({ type: 'setError', error: errorMessage(err) });
      return null;
    } finally {
      dispatch({ type: 'setSaving', value: false });
    }
  }, [slidesRepo, state.deck]);

  const deleteSlide = useCallback(
    async (slideId: string) => {
      if (!state.deck) return;
      const deckId = state.deck.id;
      // optimistic
      dispatch({ type: 'removeSlide', slideId });
      dispatch({ type: 'setSaving', value: true });
      try {
        await slidesRepo.deleteSlide(slideId);
      } catch (err) {
        dispatch({ type: 'setError', error: errorMessage(err) });
        await reload(deckId);
      } finally {
        dispatch({ type: 'setSaving', value: false });
      }
    },
    [reload, slidesRepo, state.deck],
  );

  const duplicateSlide = useCallback(
    async (slideId: string): Promise<CreatorSlide | null> => {
      if (!state.deck) return null;
      dispatch({ type: 'setSaving', value: true });
      try {
        const slide = await slidesRepo.duplicateSlide(slideId, DEV_USER_ID);
        dispatch({ type: 'addSlide', slide });
        dispatch({ type: 'setSelectedSlideId', slideId: slide.id });
        return slide;
      } catch (err) {
        dispatch({ type: 'setError', error: errorMessage(err) });
        return null;
      } finally {
        dispatch({ type: 'setSaving', value: false });
      }
    },
    [slidesRepo, state.deck],
  );

  const move = useCallback(
    async (slideId: string, direction: -1 | 1) => {
      if (!state.deck) return;
      const deckId = state.deck.id;
      const current = [...state.deck.slides].sort((a, b) => a.orderIndex - b.orderIndex);
      const idx = current.findIndex((s) => s.id === slideId);
      if (idx === -1) return;
      const target = idx + direction;
      if (target < 0 || target >= current.length) return;
      const previousOrder = current.map((s) => s.id);
      const next = [...current];
      const tmp = next[idx];
      next[idx] = next[target];
      next[target] = tmp;
      const orderedIds = next.map((s) => s.id);
      dispatch({ type: 'reorderSlides', orderedIds });
      dispatch({ type: 'setSaving', value: true });
      try {
        await slidesRepo.reorderSlides(deckId, orderedIds, DEV_USER_ID);
      } catch (err) {
        dispatch({ type: 'reorderSlides', orderedIds: previousOrder });
        dispatch({ type: 'setError', error: errorMessage(err) });
        await reload(deckId);
      } finally {
        dispatch({ type: 'setSaving', value: false });
      }
    },
    [reload, slidesRepo, state.deck],
  );

  const moveSlideUp = useCallback((slideId: string) => move(slideId, -1), [move]);
  const moveSlideDown = useCallback((slideId: string) => move(slideId, 1), [move]);

  const renameDeck = useCallback(
    async (title: string) => {
      if (!state.deck) return;
      const trimmed = title.trim();
      if (!trimmed || trimmed === state.deck.title) return;
      const deckId = state.deck.id;
      dispatch({ type: 'patchDeck', patch: { title: trimmed } });
      dispatch({ type: 'setSaving', value: true });
      try {
        await decksRepo.updateDeck(deckId, { title: trimmed }, DEV_USER_ID);
      } catch (err) {
        dispatch({ type: 'setError', error: errorMessage(err) });
        await reload(deckId);
      } finally {
        dispatch({ type: 'setSaving', value: false });
      }
    },
    [decksRepo, reload, state.deck],
  );

  // --- debounced document persistence ---------------------------------------
  // Храним pending timers и последние unsaved документы по slideId.
  // Это не попадает в state — ре-рендер только через replaceSlide.
  const pendingTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const pendingDocsRef = useRef<Map<string, unknown>>(new Map());
  const slidesRepoRef = useRef(slidesRepo);
  useEffect(() => {
    slidesRepoRef.current = slidesRepo;
  }, [slidesRepo]);

  const persistDocument = useCallback(
    async (slideId: string, document: unknown) => {
      try {
        const updated = await slidesRepoRef.current.updateSlideDocument(
          slideId,
          document,
          DEV_USER_ID,
        );
        // Сверяем с тем, что лежит в pending: если ничего нового не накопилось,
        // можем обновить слайд из ответа (на случай, если БД пересчитала updatedAt).
        if (!pendingDocsRef.current.has(slideId)) {
          dispatch({ type: 'replaceSlide', slide: updated });
        }
      } catch (err) {
        dispatch({ type: 'setError', error: errorMessage(err) });
      }
    },
    [],
  );

  const scheduleFlush = useCallback(
    (slideId: string) => {
      const existing = pendingTimersRef.current.get(slideId);
      if (existing) clearTimeout(existing);
      const timer = setTimeout(() => {
        pendingTimersRef.current.delete(slideId);
        const doc = pendingDocsRef.current.get(slideId);
        pendingDocsRef.current.delete(slideId);
        if (doc === undefined) return;
        void persistDocument(slideId, doc);
      }, SLIDE_DOCUMENT_PERSIST_DEBOUNCE_MS);
      pendingTimersRef.current.set(slideId, timer);
    },
    [persistDocument],
  );

  const updateSlideDocument = useCallback(
    (slideId: string, document: unknown) => {
      const deck = state.deck;
      if (!deck) return;
      const current = deck.slides.find((s) => s.id === slideId);
      if (!current) return;
      const validation = validateSlideDocument(document);
      const nextSlide: CreatorSlide = {
        ...current,
        document,
        validation,
      };
      dispatch({ type: 'replaceSlide', slide: nextSlide });
      pendingDocsRef.current.set(slideId, document);
      scheduleFlush(slideId);
    },
    [scheduleFlush, state.deck],
  );

  const flushPendingDocuments = useCallback(async () => {
    const entries = Array.from(pendingDocsRef.current.entries());
    pendingDocsRef.current.clear();
    pendingTimersRef.current.forEach((t) => clearTimeout(t));
    pendingTimersRef.current.clear();
    if (entries.length === 0) return;
    await Promise.all(entries.map(([id, doc]) => persistDocument(id, doc)));
  }, [persistDocument]);

  const updateSlideMeta = useCallback(
    async (
      slideId: string,
      patch: Pick<UpdateSlideMetaPatch, 'title' | 'speakerNotes'>,
    ) => {
      if (!state.deck) return;
      const hasChange = patch.title !== undefined || patch.speakerNotes !== undefined;
      if (!hasChange) return;
      dispatch({ type: 'setSaving', value: true });
      try {
        const slide = await slidesRepo.updateSlideMeta(slideId, patch, DEV_USER_ID);
        dispatch({ type: 'replaceSlide', slide });
      } catch (err) {
        dispatch({ type: 'setError', error: errorMessage(err) });
        await reload(state.deck.id);
      } finally {
        dispatch({ type: 'setSaving', value: false });
      }
    },
    [reload, slidesRepo, state.deck],
  );

  const setSlideHidden = useCallback(
    async (slideId: string, hidden: boolean) => {
      if (!state.deck) return;
      dispatch({ type: 'setSaving', value: true });
      try {
        const slide = await slidesRepo.updateSlideMeta(slideId, { hidden }, DEV_USER_ID);
        dispatch({ type: 'replaceSlide', slide });
      } catch (err) {
        dispatch({ type: 'setError', error: errorMessage(err) });
        await reload(state.deck.id);
      } finally {
        dispatch({ type: 'setSaving', value: false });
      }
    },
    [reload, slidesRepo, state.deck],
  );

  const value = useMemo<EditorStore>(
    () => ({
      ...state,
      loadDeck,
      setSelectedSlideId,
      createSlide,
      deleteSlide,
      duplicateSlide,
      moveSlideUp,
      moveSlideDown,
      renameDeck,
      setSlideHidden,
      updateSlideMeta,
      updateSlideDocument,
      flushPendingDocuments,
      clearError,
      loadAssets,
      uploadAsset,
      deleteAsset,
    }),
    [
      state,
      loadDeck,
      setSelectedSlideId,
      createSlide,
      deleteSlide,
      duplicateSlide,
      moveSlideUp,
      moveSlideDown,
      renameDeck,
      setSlideHidden,
      updateSlideMeta,
      updateSlideDocument,
      flushPendingDocuments,
      clearError,
      loadAssets,
      uploadAsset,
      deleteAsset,
    ],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useEditorStore(): EditorStore {
  const v = useContext(StoreCtx);
  if (!v) throw new Error('[creator] useEditorStore() вне EditorProvider');
  return v;
}
