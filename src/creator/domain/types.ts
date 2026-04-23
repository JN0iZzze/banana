import type { JsonSlideDocument } from '../../presentation/jsonSlideTypes';

export type CreatorDeckStatus = 'draft' | 'ready' | 'archived';
export type CreatorAssetKind = 'image' | 'video' | 'file';
export type IsoDateString = string;

export type CreatorValidation =
  | { status: 'valid'; doc: JsonSlideDocument }
  | { status: 'invalid'; error: string };

export interface CreatorDeckSummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: CreatorDeckStatus;
  slideCount: number;
  invalidSlideCount: number;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
  createdBy: string;
  updatedBy: string;
}

export interface CreatorDeck extends CreatorDeckSummary {
  slides: CreatorSlide[];
}

export interface CreatorSlide {
  id: string;
  deckId: string;
  orderIndex: number;
  title: string | null;
  speakerNotes: string | null;
  hidden: boolean;
  document: unknown;
  validation: CreatorValidation;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface CreatorAsset {
  id: string;
  deckId: string | null;
  kind: CreatorAssetKind;
  storagePath: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  createdBy: string;
  createdAt: IsoDateString;
}

export interface CreatorDeckVersion {
  id: string;
  deckId: string;
  versionNumber: number;
  snapshot: unknown;
  createdBy: string;
  createdAt: IsoDateString;
}

export function isValidSlide(
  validation: CreatorValidation,
): validation is { status: 'valid'; doc: JsonSlideDocument } {
  return validation.status === 'valid';
}
