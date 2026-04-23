import {
  CREATOR_STORAGE_BUCKET,
  MAX_ASSET_SIZE_BYTES,
  SUPPORTED_ASSET_MIME_TYPES,
  type SupportedAssetMimeType,
} from '../../constants';
import { RepositoryError, ValidationError } from '../../domain/errors';
import { getSupabaseClient } from './client';

export interface UploadedAssetDescriptor {
  storagePath: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
}

export interface UploadAssetOptions {
  deckId: string | null;
}

function isSupportedMime(mime: string): mime is SupportedAssetMimeType {
  return (SUPPORTED_ASSET_MIME_TYPES as readonly string[]).includes(mime);
}

function sanitizeFilename(name: string): string {
  const lower = name.toLowerCase();
  const replaced = lower.replace(/[^a-z0-9._-]/g, '-');
  const trimmed = replaced.replace(/^-+|-+$/g, '');
  const safe = trimmed.length > 0 ? trimmed : 'file';
  return safe.slice(0, 64);
}

async function readImageDimensions(
  file: File,
): Promise<{ width?: number; height?: number }> {
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    return {};
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
    const width = img.naturalWidth || undefined;
    const height = img.naturalHeight || undefined;
    return { width, height };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function randomUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback (не должен быть использован в современных браузерах / SSR).
  return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class SupabaseStorageAdapter {
  async uploadAsset(
    file: File,
    opts: UploadAssetOptions,
  ): Promise<UploadedAssetDescriptor> {
    const mimeType = file.type;
    if (!isSupportedMime(mimeType)) {
      throw new ValidationError(
        `Неподдерживаемый тип файла: ${mimeType || 'неизвестно'}`,
        `Допустимые типы: ${SUPPORTED_ASSET_MIME_TYPES.join(', ')}`,
      );
    }
    if (file.size > MAX_ASSET_SIZE_BYTES) {
      const mb = Math.round(MAX_ASSET_SIZE_BYTES / (1024 * 1024));
      throw new ValidationError(`Файл превышает ${mb} МБ`);
    }

    const sanitized = sanitizeFilename(file.name);
    const folder = opts.deckId ?? 'shared';
    const storagePath = `${folder}/${randomUUID()}-${sanitized}`;

    const supabase = getSupabaseClient();
    const uploadRes = await supabase.storage
      .from(CREATOR_STORAGE_BUCKET)
      .upload(storagePath, file, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false,
      });
    if (uploadRes.error) {
      throw new RepositoryError('Failed to upload asset to storage', {
        cause: uploadRes.error,
      });
    }

    const publicUrl = supabase.storage
      .from(CREATOR_STORAGE_BUCKET)
      .getPublicUrl(storagePath).data.publicUrl;

    let width: number | undefined;
    let height: number | undefined;
    if (mimeType.startsWith('image/') && mimeType !== 'image/svg+xml') {
      const dims = await readImageDimensions(file);
      width = dims.width;
      height = dims.height;
    }
    // Для video в MVP метаданные (duration / размеры кадра) не извлекаем.
    // Можно добавить позже через HTMLVideoElement + loadedmetadata.

    return {
      storagePath,
      publicUrl,
      mimeType,
      sizeBytes: file.size,
      width,
      height,
    };
  }

  async deleteAsset(storagePath: string): Promise<void> {
    const supabase = getSupabaseClient();
    const res = await supabase.storage
      .from(CREATOR_STORAGE_BUCKET)
      .remove([storagePath]);
    if (res.error) {
      throw new RepositoryError('Failed to delete asset from storage', {
        cause: res.error,
      });
    }
  }
}
