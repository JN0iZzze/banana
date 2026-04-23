/** Base class for all creator-domain errors. */
export class CreatorDomainError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'CreatorDomainError';
    if (options?.cause !== undefined) {
      (this as { cause?: unknown }).cause = options.cause;
    }
  }
}

/** Deck slug is already taken. */
export class SlugConflictError extends CreatorDomainError {
  readonly slug: string;

  constructor(slug: string) {
    super(`Deck slug already exists: ${slug}`);
    this.name = 'SlugConflictError';
    this.slug = slug;
  }
}

/** Entity not found. */
export class NotFoundError extends CreatorDomainError {
  readonly entity: string;
  readonly id: string;

  constructor(entity: string, id: string) {
    super(`${entity} not found: ${id}`);
    this.name = 'NotFoundError';
    this.entity = entity;
    this.id = id;
  }
}

/** Domain validation failed (e.g. invalid slide document). */
export class ValidationError extends CreatorDomainError {
  readonly details?: string;

  constructor(message: string, details?: string) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

/** Repository / storage layer failure (wraps network or DB errors). */
export class RepositoryError extends CreatorDomainError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'RepositoryError';
  }
}
