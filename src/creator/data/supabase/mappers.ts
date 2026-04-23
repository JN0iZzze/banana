import { validateSlideDocument } from '../../validation/validateSlideDocument';
import type {
  CreatorAsset,
  CreatorAssetKind,
  CreatorDeck,
  CreatorDeckStatus,
  CreatorDeckSummary,
  CreatorSlide,
} from '../../domain/types';

export interface DeckRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface SlideRow {
  id: string;
  deck_id: string;
  order_index: number;
  title: string | null;
  speaker_notes: string | null;
  hidden: boolean;
  document: unknown;
  validation_status: string;
  validation_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssetRow {
  id: string;
  deck_id: string | null;
  kind: string;
  storage_path: string;
  public_url: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  created_by: string;
  created_at: string;
}

function coerceDeckStatus(raw: string): CreatorDeckStatus {
  if (raw === 'draft' || raw === 'ready' || raw === 'archived') return raw;
  return 'draft';
}

function coerceAssetKind(raw: string): CreatorAssetKind {
  if (raw === 'image' || raw === 'video' || raw === 'file') return raw;
  return 'file';
}

export function mapDeckSummary(
  row: DeckRow,
  slideCount: number,
  invalidSlideCount: number,
): CreatorDeckSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    status: coerceDeckStatus(row.status),
    slideCount,
    invalidSlideCount,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapDeck(row: DeckRow, slides: CreatorSlide[]): CreatorDeck {
  const invalidSlideCount = slides.reduce(
    (acc, s) => (s.validation.status === 'invalid' ? acc + 1 : acc),
    0,
  );
  return {
    ...mapDeckSummary(row, slides.length, invalidSlideCount),
    slides,
  };
}

/**
 * Map a slide row into the domain type.
 *
 * We always re-run `validateSlideDocument(document)` and trust the resulting
 * `CreatorValidation` over `validation_status` / `validation_error` persisted
 * in the database. Those columns are maintained as a fast index for list
 * queries, but the document itself is the source of truth.
 */
export function mapSlide(row: SlideRow): CreatorSlide {
  const validation = validateSlideDocument(row.document);
  return {
    id: row.id,
    deckId: row.deck_id,
    orderIndex: row.order_index,
    title: row.title,
    speakerNotes: row.speaker_notes,
    hidden: row.hidden,
    document: row.document,
    validation,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapAsset(row: AssetRow): CreatorAsset {
  return {
    id: row.id,
    deckId: row.deck_id,
    kind: coerceAssetKind(row.kind),
    storagePath: row.storage_path,
    publicUrl: row.public_url ?? '',
    mimeType: row.mime_type ?? '',
    sizeBytes: row.size_bytes ?? 0,
    width: row.width,
    height: row.height,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}
