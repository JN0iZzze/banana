export type {
  CreatorAsset,
  CreatorAssetKind,
  CreatorDeck,
  CreatorDeckStatus,
  CreatorDeckSummary,
  CreatorDeckVersion,
  CreatorSlide,
  CreatorValidation,
  IsoDateString,
} from './domain/types';
export { isValidSlide } from './domain/types';

export type {
  CreateAssetInput,
  CreateAssetResult,
  CreateDeckInput,
  CreateDeckResult,
  CreateSlideInput,
  CreateSlideResult,
  CreatorCommand,
  DuplicateSlideResult,
  LoadDeckResult,
  UpdateDeckPatch,
  UpdateDeckResult,
  UpdateSlideDocumentPayload,
  UpdateSlideMetaPatch,
  UpdateSlideResult,
} from './domain/commands';

export {
  CreatorDomainError,
  NotFoundError,
  RepositoryError,
  SlugConflictError,
  ValidationError,
} from './domain/errors';

export type {
  CreatorAssetRepository,
  CreatorDeckRepository,
  CreatorSlideRepository,
} from './data/repositories';

export {
  CREATOR_STORAGE_BUCKET,
  DEV_USER_ID,
  MAX_ASSET_SIZE_BYTES,
  SLIDE_DOCUMENT_PERSIST_DEBOUNCE_MS,
  SUPPORTED_ASSET_MIME_TYPES,
} from './constants';
export type { SupportedAssetMimeType } from './constants';
