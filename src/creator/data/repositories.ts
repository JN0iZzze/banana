import type {
  CreateAssetInput,
  CreateDeckInput,
  CreateSlideInput,
  UpdateDeckPatch,
  UpdateSlideMetaPatch,
} from '../domain/commands';
import type {
  CreatorAsset,
  CreatorDeck,
  CreatorDeckSummary,
  CreatorSlide,
} from '../domain/types';

export interface CreatorDeckRepository {
  listDecks(): Promise<CreatorDeckSummary[]>;
  loadDeck(deckId: string): Promise<CreatorDeck>;
  createDeck(input: CreateDeckInput, userId: string): Promise<CreatorDeckSummary>;
  updateDeck(deckId: string, patch: UpdateDeckPatch, userId: string): Promise<CreatorDeckSummary>;
  deleteDeck(deckId: string): Promise<void>;
}

export interface CreatorSlideRepository {
  createSlide(deckId: string, input: CreateSlideInput, userId: string): Promise<CreatorSlide>;
  duplicateSlide(slideId: string, userId: string): Promise<CreatorSlide>;
  deleteSlide(slideId: string): Promise<void>;
  reorderSlides(deckId: string, orderedIds: string[], userId: string): Promise<void>;
  updateSlideMeta(slideId: string, patch: UpdateSlideMetaPatch, userId: string): Promise<CreatorSlide>;
  updateSlideDocument(slideId: string, document: unknown, userId: string): Promise<CreatorSlide>;
}

export interface CreatorAssetRepository {
  listAssets(deckId: string | null): Promise<CreatorAsset[]>;
  createAsset(input: CreateAssetInput, userId: string): Promise<CreatorAsset>;
  deleteAsset(assetId: string): Promise<void>;
  uploadAndCreate(
    file: File,
    opts: { deckId: string | null },
  ): Promise<CreatorAsset>;
}
