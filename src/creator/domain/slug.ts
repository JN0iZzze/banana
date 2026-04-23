export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/ё/g, 'e')
      .replace(/[^a-z0-9а-я\s-]+/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 64) || 'deck'
  );
}

const SLUG_ASCII_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  if (slug.length > 64) return false;
  return SLUG_ASCII_PATTERN.test(slug);
}
