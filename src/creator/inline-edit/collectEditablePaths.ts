/**
 * collectEditablePaths — returns a list of dot-paths to editable plain-text fields
 * in a JsonSlideDocument. Used as the foundation for the inline-editing PoC in Creator.
 *
 * Wave A: header.title, header.lead, stack.items[n].text
 * Wave B: card items, header.meta — see TODO below.
 */

export interface EditablePath {
  /** Dot-notation path, e.g. 'header.title', 'stack.items.0.text' */
  path: string;
  /** true for multi-line fields (lead, textStack text items) */
  multiline: boolean;
}

export function collectEditablePaths(doc: unknown): EditablePath[] {
  const paths: EditablePath[] = [];

  if (!isRecord(doc)) return paths;

  // --- header.title ---
  const header = doc['header'];
  if (isRecord(header)) {
    if (typeof header['title'] === 'string') {
      paths.push({ path: 'header.title', multiline: false });
    }

    // --- header.lead ---
    if (typeof header['lead'] === 'string') {
      paths.push({ path: 'header.lead', multiline: true });
    }

    // TODO: Волна B — header.meta (string)
  }

  // --- stack.items[n].text (textStack template) ---
  const stack = doc['stack'];
  if (isRecord(stack) && Array.isArray(stack['items'])) {
    const items = stack['items'] as unknown[];
    items.forEach((item, i) => {
      if (
        isRecord(item) &&
        'text' in item &&
        typeof item['text'] === 'string' &&
        item['type'] !== 'link' &&
        item['type'] !== 'image'
      ) {
        paths.push({ path: `stack.items.${i}.text`, multiline: true });
      }
    });
  }

  // TODO: Волна B — card items (layout → cards → items[n].text), quote fields, imageCover blocks.

  return paths;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Reads a nested field by dot-path.
 * Returns `undefined` if any segment of the path doesn't exist.
 *
 * @example getByPath({ header: { title: 'Hello' } }, 'header.title') // → 'Hello'
 */
export function getByPath(obj: unknown, path: string): unknown {
  const segments = path.split('.');
  let current: unknown = obj;
  for (const segment of segments) {
    if (!isRecord(current) && !Array.isArray(current)) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

/**
 * Returns a deep copy of `obj` with `value` set at the given dot-path.
 * Does NOT mutate the original object.
 * Missing intermediate objects/arrays are created as plain objects.
 *
 * @example setByPath({ header: { title: 'Old' } }, 'header.title', 'New')
 *          // → { header: { title: 'New' } }
 */
export function setByPath(obj: unknown, path: string, value: unknown): unknown {
  const segments = path.split('.');
  // structuredClone is available in modern browsers and Node 17+.
  const root = structuredClone(obj) as Record<string, unknown>;
  let current: Record<string, unknown> = root;

  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    const next = current[segment];
    if (!isRecord(next) && !Array.isArray(next)) {
      current[segment] = /^\d+$/.test(segments[i + 1] ?? '') ? [] : {};
    }
    current = current[segment] as Record<string, unknown>;
  }

  current[segments[segments.length - 1]] = value;
  return root;
}
