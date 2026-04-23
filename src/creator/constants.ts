export const DEV_USER_ID = '00000000-0000-0000-0000-000000000001';

export const CREATOR_STORAGE_BUCKET = 'creator-assets';

export const SUPPORTED_ASSET_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
] as const;

export type SupportedAssetMimeType = (typeof SUPPORTED_ASSET_MIME_TYPES)[number];

/** 50 MB. */
export const MAX_ASSET_SIZE_BYTES = 50 * 1024 * 1024;

export const SLIDE_DOCUMENT_PERSIST_DEBOUNCE_MS = 400;
