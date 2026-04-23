import { DEV_USER_ID } from '../../constants';
import type { CreateAssetInput } from '../../domain/commands';
import { NotFoundError, RepositoryError } from '../../domain/errors';
import type { CreatorAsset, CreatorAssetKind } from '../../domain/types';
import type { CreatorAssetRepository } from '../repositories';
import { getSupabaseClient } from './client';
import { mapAsset, type AssetRow } from './mappers';
import { SupabaseStorageAdapter } from './SupabaseStorageAdapter';

const ASSET_COLUMNS =
  'id, deck_id, kind, storage_path, public_url, mime_type, size_bytes, width, height, created_by, created_at';

function kindFromMime(mime: string): CreatorAssetKind {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  return 'file';
}

export class SupabaseAssetRepository implements CreatorAssetRepository {
  private readonly storage: SupabaseStorageAdapter;

  constructor(storage?: SupabaseStorageAdapter) {
    this.storage = storage ?? new SupabaseStorageAdapter();
  }

  async listAssets(deckId: string | null): Promise<CreatorAsset[]> {
    const supabase = getSupabaseClient();
    let query = supabase.from('creator_assets').select(ASSET_COLUMNS);
    query = deckId === null ? query.is('deck_id', null) : query.eq('deck_id', deckId);
    const res = await query.order('created_at', { ascending: false });
    if (res.error) {
      throw new RepositoryError('Failed to list assets', { cause: res.error });
    }
    return ((res.data ?? []) as AssetRow[]).map(mapAsset);
  }

  async createAsset(input: CreateAssetInput, userId: string): Promise<CreatorAsset> {
    const supabase = getSupabaseClient();
    const res = await supabase
      .from('creator_assets')
      .insert({
        deck_id: input.deckId,
        kind: input.kind,
        storage_path: input.storagePath,
        public_url: input.publicUrl,
        mime_type: input.mimeType,
        size_bytes: input.sizeBytes,
        width: input.width ?? null,
        height: input.height ?? null,
        created_by: userId,
      })
      .select(ASSET_COLUMNS)
      .single();
    if (res.error) {
      throw new RepositoryError('Failed to create asset', { cause: res.error });
    }
    return mapAsset(res.data as AssetRow);
  }

  async uploadAndCreate(
    file: File,
    opts: { deckId: string | null },
  ): Promise<CreatorAsset> {
    const uploaded = await this.storage.uploadAsset(file, opts);
    const kind = kindFromMime(uploaded.mimeType);
    return this.createAsset(
      {
        deckId: opts.deckId,
        kind,
        storagePath: uploaded.storagePath,
        publicUrl: uploaded.publicUrl,
        mimeType: uploaded.mimeType,
        sizeBytes: uploaded.sizeBytes,
        width: uploaded.width,
        height: uploaded.height,
      },
      DEV_USER_ID,
    );
  }

  async deleteAsset(assetId: string): Promise<void> {
    const supabase = getSupabaseClient();
    // Сначала читаем storage_path, чтобы потом снести файл.
    const readRes = await supabase
      .from('creator_assets')
      .select('storage_path')
      .eq('id', assetId)
      .single();
    if (readRes.error) {
      // PostgREST код PGRST116 — запись не найдена.
      const code = (readRes.error as { code?: string }).code;
      if (code === 'PGRST116') {
        throw new NotFoundError('CreatorAsset', assetId);
      }
      throw new RepositoryError('Failed to load asset before delete', {
        cause: readRes.error,
      });
    }
    const storagePath = (readRes.data as { storage_path: string }).storage_path;

    // Порядок: сначала удаляем запись в БД, потом файл в storage.
    // Обоснование: осиротевший файл в storage менее опасен, чем осиротевшая
    // запись в БД (на неё могут ссылаться UI / слайды).
    const delRes = await supabase.from('creator_assets').delete().eq('id', assetId);
    if (delRes.error) {
      throw new RepositoryError('Failed to delete asset', { cause: delRes.error });
    }

    try {
      await this.storage.deleteAsset(storagePath);
    } catch (err) {
      console.warn(
        '[creator] asset row deleted, but storage cleanup failed:',
        storagePath,
        err,
      );
    }
  }
}
