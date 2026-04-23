import type {
  CreatorAsset,
  CreatorAssetKind,
  CreatorDeck,
  CreatorDeckStatus,
  CreatorDeckSummary,
  CreatorSlide,
} from './types';

export interface CreateDeckInput {
  slug: string;
  title: string;
  description?: string;
}

export interface UpdateDeckPatch {
  slug?: string;
  title?: string;
  description?: string | null;
  status?: CreatorDeckStatus;
}

export interface CreateSlideInput {
  afterSlideId?: string;
  title?: string;
  speakerNotes?: string;
  document?: unknown;
}

export interface UpdateSlideMetaPatch {
  title?: string | null;
  speakerNotes?: string | null;
  hidden?: boolean;
}

export interface UpdateSlideDocumentPayload {
  slideId: string;
  document: unknown;
}

export interface CreateAssetInput {
  deckId: string | null;
  kind: CreatorAssetKind;
  storagePath: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
}

export type CreatorCommand =
  | { kind: 'deck.create'; payload: CreateDeckInput }
  | { kind: 'deck.rename'; payload: { deckId: string; title: string } }
  | { kind: 'deck.setStatus'; payload: { deckId: string; status: CreatorDeckStatus } }
  | { kind: 'deck.update'; payload: { deckId: string; patch: UpdateDeckPatch } }
  | { kind: 'deck.delete'; payload: { deckId: string } }
  | { kind: 'slide.create'; payload: { deckId: string; input: CreateSlideInput } }
  | { kind: 'slide.delete'; payload: { slideId: string } }
  | { kind: 'slide.duplicate'; payload: { slideId: string } }
  | { kind: 'slide.reorder'; payload: { deckId: string; orderedIds: string[] } }
  | { kind: 'slide.updateMeta'; payload: { slideId: string; patch: UpdateSlideMetaPatch } }
  | { kind: 'slide.updateDocument'; payload: UpdateSlideDocumentPayload }
  | { kind: 'asset.create'; payload: CreateAssetInput }
  | { kind: 'asset.delete'; payload: { assetId: string } };

export type CreateDeckResult = CreatorDeckSummary;
export type UpdateDeckResult = CreatorDeckSummary;
export type CreateSlideResult = CreatorSlide;
export type UpdateSlideResult = CreatorSlide;
export type DuplicateSlideResult = CreatorSlide;
export type CreateAssetResult = CreatorAsset;
export type LoadDeckResult = CreatorDeck;
