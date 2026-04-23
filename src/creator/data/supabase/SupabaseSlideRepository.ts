import type {
  CreateSlideInput,
  UpdateSlideMetaPatch,
} from '../../domain/commands';
import {
  NotFoundError,
  RepositoryError,
} from '../../domain/errors';
import type { CreatorSlide } from '../../domain/types';
import { createEmptySlideDocument, validateSlideDocument } from '../../validation/validateSlideDocument';
import type { CreatorSlideRepository } from '../repositories';
import { getSupabaseClient } from './client';
import { mapSlide, type SlideRow } from './mappers';

const SLIDE_COLUMNS =
  'id, deck_id, order_index, title, speaker_notes, hidden, document, validation_status, validation_error, created_at, updated_at';

function validationToColumns(document: unknown): {
  validation_status: 'valid' | 'invalid';
  validation_error: string | null;
} {
  const v = validateSlideDocument(document);
  return v.status === 'valid'
    ? { validation_status: 'valid', validation_error: null }
    : { validation_status: 'invalid', validation_error: v.error };
}

export class SupabaseSlideRepository implements CreatorSlideRepository {
  async listByDeck(deckId: string): Promise<CreatorSlide[]> {
    const supabase = getSupabaseClient();
    const res = await supabase
      .from('creator_slides')
      .select(SLIDE_COLUMNS)
      .eq('deck_id', deckId)
      .order('order_index', { ascending: true });
    if (res.error) {
      throw new RepositoryError('Failed to list slides', { cause: res.error });
    }
    return ((res.data ?? []) as SlideRow[]).map(mapSlide);
  }

  async createSlide(
    deckId: string,
    input: CreateSlideInput,
    _userId: string,
  ): Promise<CreatorSlide> {
    void _userId;
    const supabase = getSupabaseClient();

    // Compute next order_index based on current max (coalesce -1 => first = 0).
    const maxRes = await supabase
      .from('creator_slides')
      .select('order_index')
      .eq('deck_id', deckId)
      .order('order_index', { ascending: false })
      .limit(1);
    if (maxRes.error) {
      throw new RepositoryError('Failed to read max order_index', {
        cause: maxRes.error,
      });
    }
    const currentMax =
      (maxRes.data && maxRes.data.length > 0
        ? (maxRes.data[0] as { order_index: number }).order_index
        : -1);
    const nextIndex = currentMax + 1;

    const document = input.document ?? createEmptySlideDocument();
    const validation = validationToColumns(document);

    const insertRes = await supabase
      .from('creator_slides')
      .insert({
        deck_id: deckId,
        order_index: nextIndex,
        title: input.title ?? null,
        speaker_notes: input.speakerNotes ?? null,
        hidden: false,
        document,
        validation_status: validation.validation_status,
        validation_error: validation.validation_error,
      })
      .select(SLIDE_COLUMNS)
      .single();
    if (insertRes.error) {
      throw new RepositoryError('Failed to create slide', { cause: insertRes.error });
    }
    return mapSlide(insertRes.data as SlideRow);
  }

  async updateSlideMeta(
    slideId: string,
    patch: UpdateSlideMetaPatch,
    _userId: string,
  ): Promise<CreatorSlide> {
    void _userId;
    const supabase = getSupabaseClient();
    const update: Record<string, unknown> = {};
    if (patch.title !== undefined) update.title = patch.title;
    if (patch.speakerNotes !== undefined) update.speaker_notes = patch.speakerNotes;
    if (patch.hidden !== undefined) update.hidden = patch.hidden;

    const res = await supabase
      .from('creator_slides')
      .update(update)
      .eq('id', slideId)
      .select(SLIDE_COLUMNS)
      .maybeSingle();
    if (res.error) {
      throw new RepositoryError('Failed to update slide meta', { cause: res.error });
    }
    if (!res.data) {
      throw new NotFoundError('Slide', slideId);
    }
    return mapSlide(res.data as SlideRow);
  }

  async updateSlideDocument(
    slideId: string,
    document: unknown,
    _userId: string,
  ): Promise<CreatorSlide> {
    void _userId;
    const supabase = getSupabaseClient();
    const validation = validationToColumns(document);
    const res = await supabase
      .from('creator_slides')
      .update({
        document,
        validation_status: validation.validation_status,
        validation_error: validation.validation_error,
      })
      .eq('id', slideId)
      .select(SLIDE_COLUMNS)
      .maybeSingle();
    if (res.error) {
      throw new RepositoryError('Failed to update slide document', {
        cause: res.error,
      });
    }
    if (!res.data) {
      throw new NotFoundError('Slide', slideId);
    }
    return mapSlide(res.data as SlideRow);
  }

  async deleteSlide(slideId: string): Promise<void> {
    const supabase = getSupabaseClient();
    const res = await supabase.from('creator_slides').delete().eq('id', slideId);
    if (res.error) {
      throw new RepositoryError('Failed to delete slide', { cause: res.error });
    }
  }

  /**
   * Reorder slides within a deck.
   *
   * The unique index `creator_slides_deck_order_uidx (deck_id, order_index)`
   * is NOT deferrable. A direct "set each slide to its new index" pass can
   * trip the uniqueness check mid-flight. To avoid that without a server-side
   * RPC we run a two-phase client-side update:
   *   phase 1 — move every row to a unique negative "parking" index
   *             (-1 - newIdx), guaranteed not to collide with anything;
   *   phase 2 — assign the final positive index.
   *
   * If this becomes a hotspot we should migrate to a single Postgres RPC that
   * performs both phases in one transaction. Tracked as a follow-up.
   */
  async reorderSlides(
    deckId: string,
    orderedIds: string[],
    _userId: string,
  ): Promise<void> {
    void _userId;
    if (orderedIds.length === 0) return;
    const supabase = getSupabaseClient();

    // Phase 1: park each slide at a unique negative index.
    for (let i = 0; i < orderedIds.length; i += 1) {
      const id = orderedIds[i];
      const res = await supabase
        .from('creator_slides')
        .update({ order_index: -1 - i })
        .eq('id', id)
        .eq('deck_id', deckId);
      if (res.error) {
        throw new RepositoryError('Failed during reorder phase 1', {
          cause: res.error,
        });
      }
    }

    // Phase 2: assign the final indices.
    for (let i = 0; i < orderedIds.length; i += 1) {
      const id = orderedIds[i];
      const res = await supabase
        .from('creator_slides')
        .update({ order_index: i })
        .eq('id', id)
        .eq('deck_id', deckId);
      if (res.error) {
        throw new RepositoryError('Failed during reorder phase 2', {
          cause: res.error,
        });
      }
    }
  }

  async duplicateSlide(slideId: string, _userId: string): Promise<CreatorSlide> {
    void _userId;
    const supabase = getSupabaseClient();
    const loadRes = await supabase
      .from('creator_slides')
      .select(SLIDE_COLUMNS)
      .eq('id', slideId)
      .maybeSingle();
    if (loadRes.error) {
      throw new RepositoryError('Failed to load slide for duplication', {
        cause: loadRes.error,
      });
    }
    if (!loadRes.data) {
      throw new NotFoundError('Slide', slideId);
    }
    const src = loadRes.data as SlideRow;

    const maxRes = await supabase
      .from('creator_slides')
      .select('order_index')
      .eq('deck_id', src.deck_id)
      .order('order_index', { ascending: false })
      .limit(1);
    if (maxRes.error) {
      throw new RepositoryError('Failed to read max order_index', {
        cause: maxRes.error,
      });
    }
    const currentMax =
      (maxRes.data && maxRes.data.length > 0
        ? (maxRes.data[0] as { order_index: number }).order_index
        : -1);
    const nextIndex = currentMax + 1;

    const insertRes = await supabase
      .from('creator_slides')
      .insert({
        deck_id: src.deck_id,
        order_index: nextIndex,
        title: src.title,
        speaker_notes: src.speaker_notes,
        hidden: src.hidden,
        document: src.document,
        validation_status: src.validation_status,
        validation_error: src.validation_error,
      })
      .select(SLIDE_COLUMNS)
      .single();
    if (insertRes.error) {
      throw new RepositoryError('Failed to duplicate slide', {
        cause: insertRes.error,
      });
    }
    return mapSlide(insertRes.data as SlideRow);
  }
}
