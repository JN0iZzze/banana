import type { SlideTheme } from '../types';
import type {
  JsonSlideBackdrop,
  JsonSlideBackdropVariant,
  JsonSlideContent,
  JsonSlideContentAlign,
  JsonSlideContentDensity,
  JsonSlideContentWidth,
  JsonSlideFrame,
  JsonSlideFrameAlign,
  JsonSlideFramePadding,
  JsonSlideGridGap,
  JsonSlideTextStack,
  JsonSlideTextStackAlign,
  JsonSlideTextStackDocument,
  JsonSlideTextStackItem,
  JsonSlideTextStackItemContext,
  JsonSlideTextStackItemSize,
  JsonSlideTextStackItemVariant,
  JsonSlideTextStackJustify,
  JsonSlideTextStackReveal,
  JsonSlideTextStackRevealPreset,
} from '../jsonSlideTypes';
import { err, GRID_GAPS, isRecord, parseString } from './parseUtils';

type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

const THEMES = new Set<SlideTheme>(['editorial', 'signal', 'cinema']);

const FRAME_ALIGNS = new Set<JsonSlideFrameAlign>(['top', 'center', 'bottom']);
const FRAME_PADDINGS = new Set<JsonSlideFramePadding>(['compact', 'default', 'spacious']);
const BACKDROP_VARIANTS = new Set<JsonSlideBackdropVariant>(['grid', 'mesh', 'spotlight', 'none']);
const CONTENT_WIDTHS = new Set<JsonSlideContentWidth>(['full', 'wide', 'content', 'narrow']);
const CONTENT_DENSITIES = new Set<JsonSlideContentDensity>(['compact', 'comfortable', 'relaxed']);
const CONTENT_ALIGNS = new Set<JsonSlideContentAlign>(['left', 'center']);

const TEXT_STACK_ALIGNS = new Set<JsonSlideTextStackAlign>(['left', 'center', 'right']);
const TEXT_STACK_JUSTIFIES = new Set<JsonSlideTextStackJustify>(['start', 'center', 'end']);
const TEXT_STACK_REVEAL_PRESETS = new Set<JsonSlideTextStackRevealPreset>([
  'soft',
  'hero',
  'scale-in',
  'enter-up',
  'none',
]);

const TEXT_STACK_ITEM_VARIANTS = new Set<JsonSlideTextStackItemVariant>([
  'h1', 'h2', 'h3', 'lead', 'body', 'bodyLg', 'caption', 'overline', 'prompt',
]);

const TEXT_STACK_ITEM_VARIANT_HINT =
  'h1, h2, h3, lead, body, bodyLg, caption, overline, prompt';
const TEXT_STACK_ITEM_SIZES = new Set<JsonSlideTextStackItemSize>(['display', 'section', 'compact']);
const TEXT_STACK_ITEM_CONTEXTS = new Set<JsonSlideTextStackItemContext>(['default', 'onAccent']);

function parseFrame(raw: unknown): ParseResult<JsonSlideFrame> {
  if (!isRecord(raw)) {
    return err('frame must be an object');
  }
  if (raw.align !== undefined && (typeof raw.align !== 'string' || !FRAME_ALIGNS.has(raw.align as JsonSlideFrameAlign))) {
    return err('frame.align must be top, center, or bottom');
  }
  if (raw.padding !== undefined && (typeof raw.padding !== 'string' || !FRAME_PADDINGS.has(raw.padding as JsonSlideFramePadding))) {
    return err('frame.padding must be compact, default, or spacious');
  }
  return { ok: true, value: { align: raw.align as JsonSlideFrameAlign | undefined, padding: raw.padding as JsonSlideFramePadding | undefined } };
}

function parseBackdrop(raw: unknown): ParseResult<JsonSlideBackdrop> {
  if (!isRecord(raw)) {
    return err('backdrop must be an object');
  }
  if (raw.variant !== undefined && (typeof raw.variant !== 'string' || !BACKDROP_VARIANTS.has(raw.variant as JsonSlideBackdropVariant))) {
    return err('backdrop.variant must be grid, mesh, spotlight, or none');
  }
  if (raw.borderFrame !== undefined && typeof raw.borderFrame !== 'boolean') {
    return err('backdrop.borderFrame must be a boolean when present');
  }
  if (raw.dimmed !== undefined && typeof raw.dimmed !== 'boolean') {
    return err('backdrop.dimmed must be a boolean when present');
  }
  return {
    ok: true,
    value: {
      variant: raw.variant as JsonSlideBackdropVariant | undefined,
      ...(raw.borderFrame === true ? { borderFrame: true } : {}),
      ...(raw.dimmed === true ? { dimmed: true } : {}),
    },
  };
}

function parseContent(raw: unknown): ParseResult<JsonSlideContent> {
  if (!isRecord(raw)) {
    return err('content must be an object');
  }
  if (raw.width !== undefined && (typeof raw.width !== 'string' || !CONTENT_WIDTHS.has(raw.width as JsonSlideContentWidth))) {
    return err('content.width must be full, wide, content, or narrow');
  }
  if (raw.density !== undefined && (typeof raw.density !== 'string' || !CONTENT_DENSITIES.has(raw.density as JsonSlideContentDensity))) {
    return err('content.density must be compact, comfortable, or relaxed');
  }
  if (raw.align !== undefined && (typeof raw.align !== 'string' || !CONTENT_ALIGNS.has(raw.align as JsonSlideContentAlign))) {
    return err('content.align must be left or center');
  }
  return {
    ok: true,
    value: {
      width: raw.width as JsonSlideContentWidth | undefined,
      density: raw.density as JsonSlideContentDensity | undefined,
      align: raw.align as JsonSlideContentAlign | undefined,
    },
  };
}

function parseStackItem(raw: unknown, index: number): ParseResult<JsonSlideTextStackItem> {
  if (!isRecord(raw)) {
    return err(`stack.items[${index}] must be an object`);
  }

  const type = raw.type;
  if (type !== 'text' && type !== 'link') {
    return err(`stack.items[${index}].type must be "text" or "link"`);
  }

  if (type === 'link') {
    const href = parseString(raw.href, `stack.items[${index}].href`);
    if (typeof href === 'object') return href;
    const label = parseString(raw.label, `stack.items[${index}].label`);
    if (typeof label === 'object') return label;
    return { ok: true, value: { type: 'link', href, label } };
  }

  // type === 'text'
  if (typeof raw.variant !== 'string' || !TEXT_STACK_ITEM_VARIANTS.has(raw.variant as JsonSlideTextStackItemVariant)) {
    return err(`stack.items[${index}].variant must be one of: ${TEXT_STACK_ITEM_VARIANT_HINT}`);
  }
  const variant = raw.variant as JsonSlideTextStackItemVariant;

  const text = parseString(raw.text, `stack.items[${index}].text`);
  if (typeof text === 'object') return text;

  if (raw.size !== undefined) {
    if (variant !== 'h1') {
      return err(`stack.items[${index}].size is only allowed when variant is "h1"`);
    }
    if (typeof raw.size !== 'string' || !TEXT_STACK_ITEM_SIZES.has(raw.size as JsonSlideTextStackItemSize)) {
      return err(`stack.items[${index}].size must be display, section, or compact`);
    }
  }

  if (raw.context !== undefined) {
    if (typeof raw.context !== 'string' || !TEXT_STACK_ITEM_CONTEXTS.has(raw.context as JsonSlideTextStackItemContext)) {
      return err(`stack.items[${index}].context must be default or onAccent`);
    }
  }

  return {
    ok: true,
    value: {
      type: 'text',
      variant,
      text,
      ...(raw.size !== undefined && variant === 'h1' ? { size: raw.size as JsonSlideTextStackItemSize } : {}),
      ...(raw.context !== undefined ? { context: raw.context as JsonSlideTextStackItemContext } : {}),
    },
  };
}

function parseStack(raw: unknown): ParseResult<JsonSlideTextStack> {
  if (!isRecord(raw)) {
    return err('stack must be an object');
  }

  if (typeof raw.align !== 'string' || !TEXT_STACK_ALIGNS.has(raw.align as JsonSlideTextStackAlign)) {
    return err('stack.align must be left, center, or right');
  }
  if (typeof raw.justify !== 'string' || !TEXT_STACK_JUSTIFIES.has(raw.justify as JsonSlideTextStackJustify)) {
    return err('stack.justify must be start, center, or end');
  }

  if (raw.gap !== undefined && (typeof raw.gap !== 'string' || !GRID_GAPS.has(raw.gap as JsonSlideGridGap))) {
    return err('stack.gap must be xs, sm, md, or lg when present');
  }

  let reveal: JsonSlideTextStackReveal | undefined;
  if (raw.reveal !== undefined) {
    if (!isRecord(raw.reveal)) {
      return err('stack.reveal must be an object');
    }
    if (
      typeof raw.reveal.preset !== 'string' ||
      !TEXT_STACK_REVEAL_PRESETS.has(raw.reveal.preset as JsonSlideTextStackRevealPreset)
    ) {
      return err('stack.reveal.preset must be soft, hero, scale-in, enter-up, or none');
    }
    if (raw.reveal.baseDelay !== undefined && typeof raw.reveal.baseDelay !== 'number') {
      return err('stack.reveal.baseDelay must be a number when present');
    }
    if (raw.reveal.step !== undefined && typeof raw.reveal.step !== 'number') {
      return err('stack.reveal.step must be a number when present');
    }
    reveal = {
      preset: raw.reveal.preset as JsonSlideTextStackRevealPreset,
      ...(raw.reveal.baseDelay !== undefined ? { baseDelay: raw.reveal.baseDelay as number } : {}),
      ...(raw.reveal.step !== undefined ? { step: raw.reveal.step as number } : {}),
    };
  }

  if (!Array.isArray(raw.items) || raw.items.length === 0) {
    return err('stack.items must be a non-empty array');
  }

  const items: JsonSlideTextStackItem[] = [];
  for (let i = 0; i < raw.items.length; i++) {
    const itemResult = parseStackItem(raw.items[i], i);
    if (!itemResult.ok) return itemResult;
    items.push(itemResult.value);
  }

  return {
    ok: true,
    value: {
      align: raw.align as JsonSlideTextStackAlign,
      justify: raw.justify as JsonSlideTextStackJustify,
      ...(raw.gap !== undefined ? { gap: raw.gap as JsonSlideGridGap } : {}),
      ...(reveal !== undefined ? { reveal } : {}),
      items: items as [JsonSlideTextStackItem, ...JsonSlideTextStackItem[]],
    },
  };
}

export function parseTextStackDocument(
  raw: Record<string, unknown>,
): { ok: true; doc: JsonSlideTextStackDocument } | { ok: false; error: string } {
  if (raw.header !== undefined) {
    return err('textStack document must not include header');
  }
  if (raw.layout !== undefined) {
    return err('textStack document must not include layout');
  }

  let theme: SlideTheme | undefined;
  if (raw.theme !== undefined) {
    if (typeof raw.theme !== 'string' || !THEMES.has(raw.theme as SlideTheme)) {
      return err('theme must be editorial, signal, or cinema when present');
    }
    theme = raw.theme as SlideTheme;
  }

  let frame: JsonSlideFrame | undefined;
  if (raw.frame !== undefined) {
    const result = parseFrame(raw.frame);
    if (!result.ok) return result;
    frame = result.value;
  }

  let backdrop: JsonSlideBackdrop | undefined;
  if (raw.backdrop !== undefined) {
    const result = parseBackdrop(raw.backdrop);
    if (!result.ok) return result;
    backdrop = result.value;
  }

  let content: JsonSlideContent | undefined;
  if (raw.content !== undefined) {
    const result = parseContent(raw.content);
    if (!result.ok) return result;
    content = result.value;
  }

  const stackResult = parseStack(raw.stack);
  if (!stackResult.ok) return stackResult;

  const doc: JsonSlideTextStackDocument = {
    template: 'textStack',
    ...(theme !== undefined ? { theme } : {}),
    ...(frame !== undefined ? { frame } : {}),
    ...(backdrop !== undefined ? { backdrop } : {}),
    ...(content !== undefined ? { content } : {}),
    stack: stackResult.value,
  };

  return { ok: true, doc };
}
