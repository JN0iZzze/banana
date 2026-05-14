/**
 * Editable binding registry for JSON slide documents (Creator inline-edit).
 *
 * EditableBinding.path     — absolute dot-notation from the document root (`stack.items.0.text`).
 * EditableBinding.kind     — `plainText` | `structuredText` | `collectionField`.
 * EditableBinding.multiline — soft hint for the editor UI.
 * EditableBinding.enabled  — `true` for wave 1 plain-text targets; `false` is reserved.
 *
 * EditablePath / collectEditablePaths kept as a thin compatibility wrapper for legacy callers.
 */

export type EditableKind = 'plainText' | 'structuredText' | 'collectionField';

export interface EditableBinding {
  /** Absolute dot-notation path from the document root, e.g. `header.title`, `stack.items.0.text`. */
  path: string;
  kind: EditableKind;
  multiline: boolean;
  enabled: boolean;
}

export interface EditablePath {
  /** Dot-notation path, e.g. 'header.title', 'stack.items.0.text' */
  path: string;
  /** true for multi-line fields (lead, textStack text items) */
  multiline: boolean;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function collectEditableBindings(doc: unknown): EditableBinding[] {
  const out: EditableBinding[] = [];
  if (!isRecord(doc)) return out;

  collectHeader(doc, out);
  collectStack(doc, out);
  collectLayout(doc, out);
  collectCover(doc, out);

  return out;
}

export function findEditableBinding(doc: unknown, path: string): EditableBinding | null {
  const bindings = collectEditableBindings(doc);
  return bindings.find((b) => b.path === path) ?? null;
}

export function collectEditablePaths(doc: unknown): EditablePath[] {
  return collectEditableBindings(doc)
    .filter((b) => b.enabled && b.kind === 'plainText')
    .map(({ path, multiline }) => ({ path, multiline }));
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function collectHeader(doc: Record<string, unknown>, out: EditableBinding[]): void {
  const header = doc['header'];
  if (!isRecord(header)) return;

  if (typeof header['title'] === 'string') {
    out.push({ path: 'header.title', kind: 'plainText', multiline: false, enabled: true });
  }
  if (typeof header['lead'] === 'string') {
    out.push({ path: 'header.lead', kind: 'plainText', multiline: true, enabled: true });
  }
  if (typeof header['meta'] === 'string') {
    out.push({ path: 'header.meta', kind: 'plainText', multiline: false, enabled: true });
  }
}

// ---------------------------------------------------------------------------
// Text stack (textStack template)
// ---------------------------------------------------------------------------

function collectStack(doc: Record<string, unknown>, out: EditableBinding[]): void {
  const stack = doc['stack'];
  if (!isRecord(stack)) return;
  const items = stack['items'];
  if (!Array.isArray(items)) return;

  items.forEach((item, i) => {
    if (!isRecord(item)) return;
    if (item['type'] === 'link' || item['type'] === 'image') return;
    if ('chunks' in item) return;
    if (typeof item['text'] !== 'string') return;
    out.push({
      path: `stack.items.${i}.text`,
      kind: 'plainText',
      multiline: true,
      enabled: true,
    });
  });
}

// ---------------------------------------------------------------------------
// Layout dispatch
// ---------------------------------------------------------------------------

function collectLayout(doc: Record<string, unknown>, out: EditableBinding[]): void {
  const layout = doc['layout'];
  if (!isRecord(layout)) return;
  walkLayout(layout, 'layout', out);
}

function walkLayout(layout: Record<string, unknown>, base: string, out: EditableBinding[]): void {
  const type = layout['type'];
  switch (type) {
    case 'equalColumns':
    case 'asymmetricColumns':
      walkColumnItems(layout, base, out);
      break;
    case 'splitLayout':
      walkSplit(layout, base, out);
      break;
    case 'stackLayout':
      walkStackLayout(layout, base, out);
      break;
    case 'uniformGrid':
      walkUniformGrid(layout, base, out);
      break;
    case 'bentoGrid':
      walkBento(layout, base, out);
      break;
    case 'mediaGallery':
      walkMediaGallery(layout, base, out);
      break;
    default:
      break;
  }
}

function walkColumnItems(
  layout: Record<string, unknown>,
  base: string,
  out: EditableBinding[],
): void {
  const items = layout['items'];
  if (!Array.isArray(items)) return;
  items.forEach((item, i) => {
    if (!isRecord(item)) return;
    const region = item['region'];
    if (isRecord(region)) {
      walkRegion(region, `${base}.items.${i}.region`, out);
    }
  });
}

function walkSplit(layout: Record<string, unknown>, base: string, out: EditableBinding[]): void {
  const left = layout['left'];
  if (isRecord(left)) walkRegion(left, `${base}.left`, out);
  const right = layout['right'];
  if (isRecord(right)) walkRegion(right, `${base}.right`, out);
}

function walkStackLayout(
  layout: Record<string, unknown>,
  base: string,
  out: EditableBinding[],
): void {
  const items = layout['items'];
  if (!Array.isArray(items)) return;
  items.forEach((item, i) => {
    if (!isRecord(item)) return;
    const region = item['region'];
    if (isRecord(region)) {
      walkRegion(region, `${base}.items.${i}.region`, out);
    }
  });
}

function walkUniformGrid(
  layout: Record<string, unknown>,
  base: string,
  out: EditableBinding[],
): void {
  const items = layout['items'];
  if (!Array.isArray(items)) return;
  items.forEach((card, i) => {
    if (!isRecord(card)) return;
    walkCard(card, `${base}.items.${i}`, out);
  });
}

function walkBento(layout: Record<string, unknown>, base: string, out: EditableBinding[]): void {
  const items = layout['items'];
  if (!Array.isArray(items)) return;
  items.forEach((item, i) => {
    if (!isRecord(item)) return;
    const region = item['region'];
    if (isRecord(region)) {
      walkRegion(region, `${base}.items.${i}.region`, out);
    }
  });
}

function walkMediaGallery(
  layout: Record<string, unknown>,
  base: string,
  out: EditableBinding[],
): void {
  const items = layout['items'];
  if (!Array.isArray(items)) return;
  items.forEach((item, i) => {
    if (!isRecord(item)) return;
    if (typeof item['caption'] === 'string') {
      out.push({
        path: `${base}.items.${i}.caption`,
        kind: 'plainText',
        multiline: false,
        enabled: true,
      });
    }
  });
}

// ---------------------------------------------------------------------------
// Regions
// ---------------------------------------------------------------------------

function walkRegion(region: Record<string, unknown>, base: string, out: EditableBinding[]): void {
  const kind = region['kind'];
  if (kind === 'card') {
    const card = region['card'];
    if (isRecord(card)) walkCard(card, `${base}.card`, out);
    return;
  }
  if (kind === 'text') {
    const text = region['text'];
    if (isRecord(text)) walkTextRegion(text, `${base}.text`, out);
    return;
  }
  if (kind === 'quote') {
    const quote = region['quote'];
    if (isRecord(quote)) walkQuote(quote, `${base}.quote`, out);
    return;
  }
  if (kind === 'layout') {
    const layout = region['layout'];
    if (isRecord(layout)) walkLayout(layout, `${base}.layout`, out);
  }
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

function walkCard(card: Record<string, unknown>, base: string, out: EditableBinding[]): void {
  const subtitle = card['subtitle'];
  if (isRecord(subtitle) && typeof subtitle['text'] === 'string') {
    out.push({
      path: `${base}.subtitle.text`,
      kind: 'plainText',
      multiline: false,
      enabled: true,
    });
  }

  const items = card['items'];
  if (Array.isArray(items)) {
    items.forEach((item, j) => {
      collectCardItemText(item, `${base}.items.${j}`, out);
    });
  }

  const slots = card['slots'];
  if (Array.isArray(slots)) {
    slots.forEach((slot, s) => {
      if (!isRecord(slot)) return;
      const slotItems = slot['items'];
      if (!Array.isArray(slotItems)) return;
      slotItems.forEach((item, j) => {
        collectCardItemText(item, `${base}.slots.${s}.items.${j}`, out);
      });
    });
  }
}

function collectCardItemText(item: unknown, base: string, out: EditableBinding[]): void {
  if (!isRecord(item)) return;
  if (item['type'] === 'component') return;
  if ('chunks' in item) return;
  if (typeof item['text'] !== 'string') return;
  const v = item['variant'];
  const multiline =
    v === 'prompt' ||
    v === 'body' ||
    v === 'bodyLg' ||
    v === 'h2' ||
    v === 'h3';
  out.push({
    path: `${base}.text`,
    kind: 'plainText',
    multiline,
    enabled: true,
  });
}

// ---------------------------------------------------------------------------
// Text region (split/stack panes, kind: "text")
// ---------------------------------------------------------------------------

function walkTextRegion(
  region: Record<string, unknown>,
  base: string,
  out: EditableBinding[],
): void {
  const items = region['items'];
  if (!Array.isArray(items)) return;
  items.forEach((item, j) => {
    if (!isRecord(item)) return;
    if (typeof item['text'] !== 'string') return;
    out.push({
      path: `${base}.items.${j}.text`,
      kind: 'plainText',
      multiline: true,
      enabled: true,
    });
  });
}

// ---------------------------------------------------------------------------
// Quote (split panes, kind: "quote")
// ---------------------------------------------------------------------------

function walkQuote(quote: Record<string, unknown>, base: string, out: EditableBinding[]): void {
  if (typeof quote['label'] === 'string') {
    out.push({ path: `${base}.label`, kind: 'plainText', multiline: false, enabled: true });
  }
  if (typeof quote['subtitle'] === 'string') {
    out.push({ path: `${base}.subtitle`, kind: 'plainText', multiline: false, enabled: true });
  }
  if (typeof quote['text'] === 'string') {
    out.push({ path: `${base}.text`, kind: 'plainText', multiline: true, enabled: true });
  }
}

// ---------------------------------------------------------------------------
// Image cover (imageCover template)
// ---------------------------------------------------------------------------

function collectCover(doc: Record<string, unknown>, out: EditableBinding[]): void {
  const cover = doc['cover'];
  if (!isRecord(cover)) return;

  const topRail = cover['topRail'];
  if (isRecord(topRail)) collectRail(topRail, 'cover.topRail', out);

  const bottomRail = cover['bottomRail'];
  if (isRecord(bottomRail)) collectRail(bottomRail, 'cover.bottomRail', out);

  const headline = cover['headline'];
  if (isRecord(headline)) {
    const blocks = headline['blocks'];
    if (Array.isArray(blocks)) {
      blocks.forEach((block, i) => {
        if (!isRecord(block)) return;
        if (typeof block['text'] !== 'string') return;
        out.push({
          path: `cover.headline.blocks.${i}.text`,
          kind: 'plainText',
          multiline: true,
          enabled: true,
        });
      });
    }
  }
}

function collectRail(
  rail: Record<string, unknown>,
  base: string,
  out: EditableBinding[],
): void {
  const items = rail['items'];
  if (!Array.isArray(items)) return;
  items.forEach((item, i) => {
    if (!isRecord(item)) return;
    if (item['kind'] !== 'text') return;
    const lines = item['lines'];
    if (!Array.isArray(lines)) return;
    lines.forEach((line, j) => {
      if (typeof line !== 'string') return;
      out.push({
        path: `${base}.items.${i}.lines.${j}`,
        kind: 'plainText',
        multiline: false,
        enabled: true,
      });
    });
  });
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
