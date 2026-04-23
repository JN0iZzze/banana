import type { PostgrestError } from '@supabase/supabase-js';
import type {
  CreateDeckInput,
  UpdateDeckPatch,
} from '../../domain/commands';
import {
  NotFoundError,
  RepositoryError,
  SlugConflictError,
} from '../../domain/errors';
import type {
  CreatorDeck,
  CreatorDeckSummary,
} from '../../domain/types';
import type { CreatorDeckRepository } from '../repositories';
import { getSupabaseClient } from './client';
import {
  mapDeck,
  mapDeckSummary,
  mapSlide,
  type DeckRow,
  type SlideRow,
} from './mappers';

const DECK_COLUMNS =
  'id, slug, title, description, status, created_by, updated_by, created_at, updated_at';
const SLIDE_COLUMNS =
  'id, deck_id, order_index, title, speaker_notes, hidden, document, validation_status, validation_error, created_at, updated_at';

function isUniqueViolation(err: PostgrestError | null | undefined): boolean {
  return !!err && err.code === '23505';
}

export class SupabaseDeckRepository implements CreatorDeckRepository {
  async listDecks(): Promise<CreatorDeckSummary[]> {
    const supabase = getSupabaseClient();
    const decksRes = await supabase
      .from('creator_decks')
      .select(DECK_COLUMNS)
      .order('updated_at', { ascending: false });
    if (decksRes.error) {
      throw new RepositoryError('Failed to list decks', { cause: decksRes.error });
    }
    const rows = (decksRes.data ?? []) as DeckRow[];
    if (rows.length === 0) return [];

    // Aggregate slide counts on the client from a single light select.
    const countsRes = await supabase
      .from('creator_slides')
      .select('deck_id, validation_status');
    if (countsRes.error) {
      throw new RepositoryError('Failed to aggregate slide counts', {
        cause: countsRes.error,
      });
    }
    const counts = new Map<string, { total: number; invalid: number }>();
    for (const r of (countsRes.data ?? []) as Array<{ deck_id: string; validation_status: string }>) {
      const bucket = counts.get(r.deck_id) ?? { total: 0, invalid: 0 };
      bucket.total += 1;
      if (r.validation_status === 'invalid') bucket.invalid += 1;
      counts.set(r.deck_id, bucket);
    }

    return rows.map((row) => {
      const c = counts.get(row.id) ?? { total: 0, invalid: 0 };
      return mapDeckSummary(row, c.total, c.invalid);
    });
  }

  async loadDeck(deckId: string): Promise<CreatorDeck> {
    const supabase = getSupabaseClient();
    const deckRes = await supabase
      .from('creator_decks')
      .select(DECK_COLUMNS)
      .eq('id', deckId)
      .maybeSingle();
    if (deckRes.error) {
      throw new RepositoryError('Failed to load deck', { cause: deckRes.error });
    }
    if (!deckRes.data) {
      throw new NotFoundError('Deck', deckId);
    }
    const deckRow = deckRes.data as DeckRow;

    const slidesRes = await supabase
      .from('creator_slides')
      .select(SLIDE_COLUMNS)
      .eq('deck_id', deckId)
      .order('order_index', { ascending: true });
    if (slidesRes.error) {
      throw new RepositoryError('Failed to load slides', { cause: slidesRes.error });
    }
    const slides = ((slidesRes.data ?? []) as SlideRow[]).map(mapSlide);
    return mapDeck(deckRow, slides);
  }

  async createDeck(input: CreateDeckInput, userId: string): Promise<CreatorDeckSummary> {
    const supabase = getSupabaseClient();
    const payload = {
      slug: input.slug,
      title: input.title,
      description: input.description ?? null,
      created_by: userId,
      updated_by: userId,
    };
    const res = await supabase
      .from('creator_decks')
      .insert(payload)
      .select(DECK_COLUMNS)
      .single();
    if (res.error) {
      if (isUniqueViolation(res.error)) {
        throw new SlugConflictError(input.slug);
      }
      throw new RepositoryError('Failed to create deck', { cause: res.error });
    }
    return mapDeckSummary(res.data as DeckRow, 0, 0);
  }

  async updateDeck(
    deckId: string,
    patch: UpdateDeckPatch,
    userId: string,
  ): Promise<CreatorDeckSummary> {
    const supabase = getSupabaseClient();
    const update: Record<string, unknown> = { updated_by: userId };
    if (patch.slug !== undefined) update.slug = patch.slug;
    if (patch.title !== undefined) update.title = patch.title;
    if (patch.description !== undefined) update.description = patch.description;
    if (patch.status !== undefined) update.status = patch.status;

    const res = await supabase
      .from('creator_decks')
      .update(update)
      .eq('id', deckId)
      .select(DECK_COLUMNS)
      .maybeSingle();
    if (res.error) {
      if (isUniqueViolation(res.error) && patch.slug !== undefined) {
        throw new SlugConflictError(patch.slug);
      }
      throw new RepositoryError('Failed to update deck', { cause: res.error });
    }
    if (!res.data) {
      throw new NotFoundError('Deck', deckId);
    }
    const row = res.data as DeckRow;

    // Pull fresh slide counts.
    const countsRes = await supabase
      .from('creator_slides')
      .select('validation_status')
      .eq('deck_id', deckId);
    if (countsRes.error) {
      throw new RepositoryError('Failed to aggregate slide counts', {
        cause: countsRes.error,
      });
    }
    const data = (countsRes.data ?? []) as Array<{ validation_status: string }>;
    const invalid = data.reduce((a, r) => (r.validation_status === 'invalid' ? a + 1 : a), 0);
    return mapDeckSummary(row, data.length, invalid);
  }

  async deleteDeck(deckId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const res = await supabase.from('creator_decks').delete().eq('id', deckId);
    if (res.error) {
      throw new RepositoryError('Failed to delete deck', { cause: res.error });
    }
  }
}
