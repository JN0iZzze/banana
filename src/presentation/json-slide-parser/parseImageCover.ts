import type { SlideTheme } from '../types';
import type {
  JsonImageCover,
  JsonImageCoverBackground,
  JsonImageCoverBottomRail,
  JsonImageCoverClusterGap,
  JsonImageCoverHeadline,
  JsonImageCoverHeadlineBlock,
  JsonImageCoverHeadlineBlockFont,
  JsonImageCoverHeadlineBlockSize,
  JsonImageCoverHeadlineColor,
  JsonImageCoverHeadlineStack,
  JsonImageCoverOverlay,
  JsonImageCoverRailItem,
  JsonImageCoverRailRow,
  JsonImageCoverRailText,
  JsonImageCoverRailTextStyle,
  JsonImageCoverRailTone,
  JsonSlideImageCoverDocument,
} from '../jsonSlideTypes';
import { err, isRecord, parseOptionalString, parseString } from './parseUtils';

const THEMES = new Set<SlideTheme>(['editorial', 'signal', 'cinema']);

const OVERLAYS = new Set<JsonImageCoverOverlay>(['none', 'gradientPinkBottom', 'gradientBg55', 'gradientBg80']);

const RAIL_STYLES = new Set<JsonImageCoverRailTextStyle>(['plain', 'label', 'inverted']);
const RAIL_TONES = new Set<JsonImageCoverRailTone>(['default', 'inverted']);
const RAIL_ALIGNS = new Set<NonNullable<JsonImageCoverRailText['textAlign']>>(['left', 'center', 'right']);
const CLUSTER_GAPS = new Set<JsonImageCoverClusterGap>(['md', 'lg']);
const HEADLINE_FONTS = new Set<JsonImageCoverHeadlineBlockFont>(['display', 'serif']);
const HEADLINE_SIZES = new Set<JsonImageCoverHeadlineBlockSize>(['jumbo', 'mega', 'display', 'displayTight', 'hero']);
const HEADLINE_COLORS = new Set<JsonImageCoverHeadlineColor>(['textSoft', 'white', 'gold']);
const HEADLINE_OFFSETS = new Set<100 | 220 | 280>([100, 220, 280]);
const HEADLINE_STACKS = new Set<JsonImageCoverHeadlineStack>(['br', 'tight', 'none']);
const WEIGHTS = new Set<NonNullable<JsonImageCoverHeadlineBlock['weight']>>(['normal', 'semibold']);

function parseBoolean(value: unknown, field: string): boolean | { ok: false; error: string } {
  if (typeof value !== 'boolean') {
    return err(`${field} must be a boolean`);
  }
  return value;
}

function parseBackground(raw: unknown): JsonImageCoverBackground | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return err('cover.background must be an object');
  }
  const src = parseString(raw.src, 'cover.background.src');
  if (typeof src === 'object' && 'ok' in src) {
    return src;
  }
  if (raw.overlay == null) {
    return err('cover.background.overlay is required');
  }
  if (typeof raw.overlay !== 'string' || !OVERLAYS.has(raw.overlay as JsonImageCoverOverlay)) {
    return err('cover.background.overlay must be none, gradientPinkBottom, gradientBg55, or gradientBg80');
  }
  const altResult = parseOptionalString(raw.alt, 'cover.background.alt');
  if (typeof altResult === 'object' && altResult !== null && 'ok' in altResult) {
    return altResult;
  }
  const alt = altResult as string | undefined;
  return {
    src,
    overlay: raw.overlay as JsonImageCoverOverlay,
    ...(alt != null && alt.length > 0 ? { alt } : {}),
  };
}

function parseLines(value: unknown, field: string): string[] | { ok: false; error: string } {
  if (!Array.isArray(value) || !value.every((l) => typeof l === 'string')) {
    return err(`${field} must be a string array`);
  }
  if (value.length < 1) {
    return err(`${field} must be non-empty`);
  }
  return value as string[];
}

function parseRailText(raw: unknown, field: string): JsonImageCoverRailText | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return err(`${field} must be an object`);
  }
  if (raw.kind !== 'text') {
    return err(`${field}.kind must be "text"`);
  }
  const lines = parseLines(raw.lines, `${field}.lines`);
  if (typeof lines === 'object' && 'ok' in lines) {
    return lines;
  }
  let textAlign: JsonImageCoverRailText['textAlign'];
  if (raw.textAlign !== undefined) {
    if (typeof raw.textAlign !== 'string' || !RAIL_ALIGNS.has(raw.textAlign as NonNullable<typeof textAlign>)) {
      return err(`${field}.textAlign must be left, center, or right when present`);
    }
    textAlign = raw.textAlign as typeof textAlign;
  }
  let style: JsonImageCoverRailTextStyle | undefined;
  if (raw.style !== undefined) {
    if (typeof raw.style !== 'string' || !RAIL_STYLES.has(raw.style as JsonImageCoverRailTextStyle)) {
      return err(`${field}.style must be plain, label, or inverted when present`);
    }
    style = raw.style as JsonImageCoverRailTextStyle;
  }
  return { kind: 'text', lines, ...(textAlign !== undefined ? { textAlign } : {}), ...(style !== undefined ? { style } : {}) };
}

function parseCluster(raw: unknown, field: string): JsonImageCoverRailItem | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return err(`${field} must be an object`);
  }
  if (raw.kind !== 'cluster') {
    return err(`${field}.kind must be "cluster"`);
  }
  if (typeof raw.gap !== 'string' || !CLUSTER_GAPS.has(raw.gap as JsonImageCoverClusterGap)) {
    return err(`${field}.gap must be md or lg`);
  }
  if (!Array.isArray(raw.items) || raw.items.length < 1) {
    return err(`${field}.items must be a non-empty array`);
  }
  const items: { lines: string[] }[] = [];
  for (let i = 0; i < raw.items.length; i += 1) {
    const el = raw.items[i];
    if (!isRecord(el)) {
      return err(`${field}.items[${i}] must be an object`);
    }
    const lines = parseLines(el.lines, `${field}.items[${i}].lines`);
    if (typeof lines === 'object' && 'ok' in lines) {
      return lines;
    }
    items.push({ lines });
  }
  return { kind: 'cluster', gap: raw.gap as JsonImageCoverClusterGap, items };
}

function parseRailItem(raw: unknown, field: string): JsonImageCoverRailItem | { ok: false; error: string } {
  if (!isRecord(raw) || raw.kind == null) {
    return err(`${field} must be an object with kind`);
  }
  if (raw.kind === 'text') {
    return parseRailText(raw, field);
  }
  if (raw.kind === 'cluster') {
    return parseCluster(raw, field);
  }
  return err(`${field}.kind must be "text" or "cluster"`);
}

function parseRailRow(raw: unknown, field: string): JsonImageCoverRailRow | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return err(`${field} must be an object`);
  }
  if (raw.variant !== 'two' && raw.variant !== 'three') {
    return err(`${field}.variant must be two or three`);
  }
  if (!Array.isArray(raw.items)) {
    return err(`${field}.items must be an array`);
  }
  const expected = raw.variant === 'two' ? 2 : 3;
  if (raw.items.length !== expected) {
    return err(`${field}.items must have length ${expected} for variant "${raw.variant}"`);
  }
  let tone: JsonImageCoverRailTone | undefined;
  if (raw.tone !== undefined) {
    if (typeof raw.tone !== 'string' || !RAIL_TONES.has(raw.tone as JsonImageCoverRailTone)) {
      return err(`${field}.tone must be default or inverted when present`);
    }
    tone = raw.tone as JsonImageCoverRailTone;
  }
  const items: JsonImageCoverRailItem[] = [];
  for (let i = 0; i < raw.items.length; i += 1) {
    const item = parseRailItem(raw.items[i], `${field}.items[${i}]`);
    if (typeof item === 'object' && 'ok' in item) {
      return item;
    }
    items.push(item);
  }
  if (raw.variant === 'two') {
    return {
      variant: 'two',
      items: [items[0], items[1]] as [JsonImageCoverRailItem, JsonImageCoverRailItem],
      ...(tone !== undefined ? { tone } : {}),
    };
  }
  return {
    variant: 'three',
    items: [items[0], items[1], items[2]] as [JsonImageCoverRailItem, JsonImageCoverRailItem, JsonImageCoverRailItem],
    ...(tone !== undefined ? { tone } : {}),
  };
}

function parseHeadlineBlock(raw: unknown, field: string): JsonImageCoverHeadlineBlock | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return err(`${field} must be an object`);
  }
  const text = parseString(raw.text, `${field}.text`);
  if (typeof text === 'object' && 'ok' in text) {
    return text;
  }
  if (typeof raw.font !== 'string' || !HEADLINE_FONTS.has(raw.font as JsonImageCoverHeadlineBlockFont)) {
    return err(`${field}.font must be display or serif`);
  }
  if (typeof raw.size !== 'string' || !HEADLINE_SIZES.has(raw.size as JsonImageCoverHeadlineBlockSize)) {
    return err(`${field}.size must be jumbo, mega, display, displayTight, or hero`);
  }
  if (typeof raw.color !== 'string' || !HEADLINE_COLORS.has(raw.color as JsonImageCoverHeadlineColor)) {
    return err(`${field}.color must be textSoft, white, or gold`);
  }
  if (raw.italic !== undefined && typeof raw.italic !== 'boolean') {
    return err(`${field}.italic must be a boolean when present`);
  }
  if (raw.weight !== undefined) {
    if (typeof raw.weight !== 'string' || !WEIGHTS.has(raw.weight as NonNullable<JsonImageCoverHeadlineBlock['weight']>)) {
      return err(`${field}.weight must be normal or semibold when present`);
    }
  }
  return {
    text,
    font: raw.font as JsonImageCoverHeadlineBlockFont,
    size: raw.size as JsonImageCoverHeadlineBlockSize,
    color: raw.color as JsonImageCoverHeadlineColor,
    ...(raw.italic === true ? { italic: true } : {}),
    ...(raw.weight != null ? { weight: raw.weight as NonNullable<JsonImageCoverHeadlineBlock['weight']> } : {}),
  };
}

function parseHeadline(raw: unknown): JsonImageCoverHeadline | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return err('cover.headline must be an object');
  }
  if (raw.align !== 'center') {
    return err('cover.headline.align must be center');
  }
  if (raw.offsetYPx == null) {
    return err('cover.headline.offsetYPx is required');
  }
  if (typeof raw.offsetYPx !== 'number' || !HEADLINE_OFFSETS.has(raw.offsetYPx as 100 | 220 | 280)) {
    return err('cover.headline.offsetYPx must be 100, 220, or 280');
  }
  if (raw.stack == null) {
    return err('cover.headline.stack is required');
  }
  if (typeof raw.stack !== 'string' || !HEADLINE_STACKS.has(raw.stack as JsonImageCoverHeadlineStack)) {
    return err('cover.headline.stack must be br, tight, or none');
  }
  if (!Array.isArray(raw.blocks) || raw.blocks.length < 1) {
    return err('cover.headline.blocks must be a non-empty array');
  }
  const blocks: JsonImageCoverHeadlineBlock[] = [];
  for (let i = 0; i < raw.blocks.length; i += 1) {
    const b = parseHeadlineBlock(raw.blocks[i], `cover.headline.blocks[${i}]`);
    if (typeof b === 'object' && 'ok' in b) {
      return b;
    }
    blocks.push(b);
  }
  return {
    align: 'center',
    offsetYPx: raw.offsetYPx as 100 | 220 | 280,
    stack: raw.stack as JsonImageCoverHeadlineStack,
    blocks,
  };
}

function parseBottomRail(raw: unknown): JsonImageCoverBottomRail | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return err('cover.bottomRail must be an object');
  }
  if (raw.variant !== 'three') {
    return err('cover.bottomRail.variant must be three');
  }
  if (!Array.isArray(raw.items) || raw.items.length !== 3) {
    return err('cover.bottomRail.items must be an array of length 3');
  }
  const items: JsonImageCoverRailItem[] = [];
  for (let i = 0; i < 3; i += 1) {
    const item = parseRailItem(raw.items[i], `cover.bottomRail.items[${i}]`);
    if (typeof item === 'object' && 'ok' in item) {
      return item;
    }
    items.push(item);
  }
  let centerAccent: JsonImageCoverBottomRail['centerAccent'];
  if (raw.centerAccent !== undefined) {
    if (!isRecord(raw.centerAccent) || raw.centerAccent.type !== 'rule') {
      return err('cover.bottomRail.centerAccent must be { "type": "rule" } when present');
    }
    centerAccent = { type: 'rule' };
  }
  return {
    variant: 'three',
    items: [items[0], items[1], items[2]],
    ...(centerAccent !== undefined ? { centerAccent } : {}),
  };
}

function parseCover(raw: unknown): JsonImageCover | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return err('cover must be an object');
  }
  const background = parseBackground(raw.background);
  if (typeof background === 'object' && 'ok' in background) {
    return background;
  }
  const fr = parseBoolean(raw.frame, 'cover.frame');
  if (typeof fr === 'object' && 'ok' in fr) {
    return fr;
  }
  const topRail = parseRailRow(raw.topRail, 'cover.topRail');
  if (typeof topRail === 'object' && 'ok' in topRail) {
    return topRail;
  }
  const headline = parseHeadline(raw.headline);
  if (typeof headline === 'object' && 'ok' in headline) {
    return headline;
  }
  const bottomRail = parseBottomRail(raw.bottomRail);
  if (typeof bottomRail === 'object' && 'ok' in bottomRail) {
    return bottomRail;
  }
  return { background, frame: fr, topRail, headline, bottomRail };
}

export function parseImageCoverDocument(raw: Record<string, unknown>):
  | { ok: true; doc: JsonSlideImageCoverDocument }
  | { ok: false; error: string } {
  if (raw.theme !== undefined) {
    if (typeof raw.theme !== 'string' || !THEMES.has(raw.theme as SlideTheme)) {
      return err('theme must be editorial, signal, or cinema when present');
    }
  }
  if (raw.cover == null) {
    return err('template imageCover requires cover');
  }
  const cover = parseCover(raw.cover);
  if (typeof cover === 'object' && 'ok' in cover) {
    return cover;
  }
  const doc: JsonSlideImageCoverDocument = {
    template: 'imageCover',
    cover,
    ...(raw.theme != null && typeof raw.theme === 'string' ? { theme: raw.theme as SlideTheme } : {}),
  };
  return { ok: true, doc };
}
