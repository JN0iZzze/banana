import type {
  JsonSlideBentoItem,
  JsonSlideCard,
  JsonSlideCardIconId,
  JsonSlideColumnItem,
  JsonSlideGridGap,
  JsonSlideLayout,
  JsonSlideLayoutDecoration,
  JsonSlideLayoutIconBadgeDecorationSize,
  JsonSlideLayoutIconBadgeDecorationTone,
  JsonSlideMediaGalleryCellVariant,
  JsonSlideMediaGalleryItem,
  JsonSlideMediaGalleryLayout,
  JsonSlideMediaGalleryPreset,
  JsonSlideMediaGalleryVerticalAlign,
  JsonSlideMediaRowJustify,
  JsonSlideQuote,
  JsonSlideRegion,
  JsonSlideStackItem,
  JsonSlideTextRegionPayload,
} from '../jsonSlideTypes';
import { JSON_SLIDE_CARD_ICON_IDS } from '../jsonSlideTypes';
import { parseCard, parseTextRegionPayload } from './parseCard';
import {
  MEDIA_GALLERY_CELL_VARIANTS,
  MEDIA_GALLERY_PRESETS,
  MEDIA_GALLERY_VERTICAL_ALIGNS,
  MEDIA_ROW_JUSTIFIES,
  parseMediaGalleryItems,
} from './parseMediaGallery';
import { err, GRID_GAPS, isRecord, parseOptionalString } from './parseUtils';

export const SPLIT_LAYOUT_MAX_DEPTH = 4;

const CARD_ICON_IDS = new Set<string>(JSON_SLIDE_CARD_ICON_IDS);
const LAYOUT_DECORATION_ICON_BADGE_ANCHORS = new Set(['center']);
const LAYOUT_DECORATION_ICON_BADGE_TONES = new Set<JsonSlideLayoutIconBadgeDecorationTone>(['surface', 'accent']);
const LAYOUT_DECORATION_ICON_BADGE_SIZES = new Set<JsonSlideLayoutIconBadgeDecorationSize>(['md', 'lg', 'xl']);

function parseLayoutDecorations(
  raw: unknown,
  path: string,
): JsonSlideLayoutDecoration[] | { ok: false; error: string } {
  if (!Array.isArray(raw)) {
    return err(`${path} must be an array`);
  }
  const out: JsonSlideLayoutDecoration[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const el = raw[i];
    if (!isRecord(el)) {
      return err(`${path}[${i}] must be an object`);
    }
    const dtype = el.type;
    if (dtype !== 'iconBadge') {
      return err(`${path}[${i}].type must be iconBadge`);
    }
    const anchor = el.anchor;
    if (typeof anchor !== 'string' || !LAYOUT_DECORATION_ICON_BADGE_ANCHORS.has(anchor)) {
      return err(`${path}[${i}].anchor must be center`);
    }
    const iconRaw = el.icon;
    if (typeof iconRaw !== 'string' || !CARD_ICON_IDS.has(iconRaw)) {
      return err(`${path}[${i}].icon must be a known icon id`);
    }
    const icon = iconRaw as JsonSlideCardIconId;

    let tone: JsonSlideLayoutIconBadgeDecorationTone = 'surface';
    if (el.tone !== undefined) {
      if (typeof el.tone !== 'string' || !LAYOUT_DECORATION_ICON_BADGE_TONES.has(el.tone as JsonSlideLayoutIconBadgeDecorationTone)) {
        return err(`${path}[${i}].tone must be surface or accent when present`);
      }
      tone = el.tone as JsonSlideLayoutIconBadgeDecorationTone;
    }

    let size: JsonSlideLayoutIconBadgeDecorationSize = 'md';
    if (el.size !== undefined) {
      if (typeof el.size !== 'string' || !LAYOUT_DECORATION_ICON_BADGE_SIZES.has(el.size as JsonSlideLayoutIconBadgeDecorationSize)) {
        return err(`${path}[${i}].size must be md, lg, or xl when present`);
      }
      size = el.size as JsonSlideLayoutIconBadgeDecorationSize;
    }

    out.push({
      type: 'iconBadge',
      anchor: 'center',
      icon,
      tone,
      size,
    });
  }
  return out;
}

function parseUniformGridCardItems(
  raw: unknown,
  path: string,
): JsonSlideCard[] | { ok: false; error: string } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return err(`${path} must be a non-empty array`);
  }
  const cards: JsonSlideCard[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const card = parseCard(raw[i], `${path}[${i}]`);
    if ('ok' in card && card.ok === false) {
      return card;
    }
    cards.push(card as JsonSlideCard);
  }
  return cards;
}

function parseColumnItems(
  raw: unknown,
  path: string,
  splitNestRemaining: number,
): JsonSlideColumnItem[] | { ok: false; error: string } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return err(`${path} must be a non-empty array`);
  }
  const nextNest = splitNestRemaining - 1;
  const items: JsonSlideColumnItem[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const el = raw[i];
    if (!isRecord(el)) {
      return err(`${path}[${i}] must be an object`);
    }
    if (typeof el.span !== 'number' || !Number.isInteger(el.span) || el.span < 1 || el.span > 12) {
      return err(`${path}[${i}].span must be an integer 1–12`);
    }
    const region = parseRegion(el.region, `${path}[${i}].region`, nextNest);
    if ('ok' in region && region.ok === false) {
      return region;
    }
    items.push({ span: el.span, region: region as JsonSlideRegion });
  }
  return items;
}

function parseBentoItems(
  raw: unknown,
  path: string,
  columns: number,
  rows: number,
  splitNestRemaining: number,
): JsonSlideBentoItem[] | { ok: false; error: string } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return err(`${path} must be a non-empty array`);
  }
  const items: JsonSlideBentoItem[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const el = raw[i];
    if (!isRecord(el)) {
      return err(`${path}[${i}] must be an object`);
    }
    const { colStart, rowStart, colSpan, rowSpan } = el;
    if (typeof colStart !== 'number' || !Number.isInteger(colStart) || colStart < 1) {
      return err(`${path}[${i}].colStart must be a positive integer`);
    }
    if (typeof rowStart !== 'number' || !Number.isInteger(rowStart) || rowStart < 1) {
      return err(`${path}[${i}].rowStart must be a positive integer`);
    }
    if (typeof colSpan !== 'number' || !Number.isInteger(colSpan) || colSpan < 1) {
      return err(`${path}[${i}].colSpan must be a positive integer`);
    }
    if (typeof rowSpan !== 'number' || !Number.isInteger(rowSpan) || rowSpan < 1) {
      return err(`${path}[${i}].rowSpan must be a positive integer`);
    }
    if (colStart + colSpan - 1 > columns) {
      return err(`${path}[${i}] overflows grid columns (${colStart}+${colSpan - 1} > ${columns})`);
    }
    if (rowStart + rowSpan - 1 > rows) {
      return err(`${path}[${i}] overflows grid rows (${rowStart}+${rowSpan - 1} > ${rows})`);
    }
    let region: JsonSlideBentoItem['region'] | { ok: false; error: string };
    if (el.region !== undefined) {
      const parsedRegion = parseRegion(el.region, `${path}[${i}].region`, splitNestRemaining);
      if ('ok' in parsedRegion && parsedRegion.ok === false) {
        return parsedRegion;
      }
      const bentoRegion = parsedRegion as JsonSlideRegion;
      if (bentoRegion.kind !== 'card' && bentoRegion.kind !== 'layout') {
        return err(`${path}[${i}].region.kind must be card or layout`);
      }
      region = bentoRegion;
    } else if (el.card !== undefined) {
      const card = parseCard(el.card, `${path}[${i}].card`);
      if ('ok' in card && card.ok === false) {
        return card;
      }
      region = { kind: 'card', card: card as JsonSlideCard };
    } else {
      return err(`${path}[${i}] must include region or card`);
    }
    items.push({
      colStart,
      rowStart,
      colSpan,
      rowSpan,
      region: region as JsonSlideBentoItem['region'],
    });
  }
  return items;
}

function parseStackItems(
  raw: unknown,
  path: string,
  splitNestRemaining: number,
): JsonSlideStackItem[] | { ok: false; error: string } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return err(`${path} must be a non-empty array`);
  }
  const items: JsonSlideStackItem[] = [];
  let sum = 0;
  for (let i = 0; i < raw.length; i += 1) {
    const el = raw[i];
    if (!isRecord(el)) {
      return err(`${path}[${i}] must be an object`);
    }
    const span = el.span;
    if (typeof span !== 'number' || !Number.isInteger(span) || span < 1 || span > 12) {
      return err(`${path}[${i}].span must be an integer 1–12`);
    }
    sum += span;
    const region = parseRegion(el.region, `${path}[${i}].region`, splitNestRemaining);
    if ('ok' in region && region.ok === false) {
      return region;
    }
    items.push({ span, region: region as JsonSlideRegion });
  }
  if (sum !== 12) {
    return err(`${path} stack spans must sum to 12 (got ${sum})`);
  }
  return items;
}

function parseQuote(raw: unknown, path: string): JsonSlideQuote | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return err(`${path} must be an object`);
  }
  const labelResult = parseOptionalString(raw.label, `${path}.label`);
  if (typeof labelResult === 'object' && labelResult !== null && 'ok' in labelResult && labelResult.ok === false) {
    return labelResult;
  }
  const subtitleResult = parseOptionalString(raw.subtitle, `${path}.subtitle`);
  if (
    typeof subtitleResult === 'object' &&
    subtitleResult !== null &&
    'ok' in subtitleResult &&
    subtitleResult.ok === false
  ) {
    return subtitleResult;
  }
  const textResult = parseOptionalString(raw.text, `${path}.text`);
  if (typeof textResult === 'object' && textResult !== null && 'ok' in textResult && textResult.ok === false) {
    return textResult;
  }

  let paragraphs: string[] | undefined;
  if (raw.paragraphs !== undefined) {
    if (!Array.isArray(raw.paragraphs)) {
      return err(`${path}.paragraphs must be an array of strings when present`);
    }
    paragraphs = [];
    for (let i = 0; i < raw.paragraphs.length; i += 1) {
      const el = raw.paragraphs[i];
      if (typeof el !== 'string') {
        return err(`${path}.paragraphs[${i}] must be a string`);
      }
      paragraphs.push(el);
    }
    if (paragraphs.length === 0) {
      return err(`${path}.paragraphs must be non-empty when present`);
    }
  }

  const textTrimmed =
    (textResult as string | undefined) != null && (textResult as string).trim().length > 0
      ? (textResult as string)
      : undefined;
  const hasBody =
    textTrimmed != null ? true : paragraphs != null && paragraphs.some((p) => p.trim().length > 0);
  if (!hasBody) {
    return err(`${path} must include non-empty text or paragraphs`);
  }

  return {
    ...(labelResult != null && (labelResult as string).trim().length > 0
      ? { label: (labelResult as string).trim() }
      : {}),
    ...(subtitleResult != null && (subtitleResult as string).trim().length > 0
      ? { subtitle: (subtitleResult as string).trim() }
      : {}),
    ...(textTrimmed != null ? { text: textTrimmed } : {}),
    ...(paragraphs !== undefined ? { paragraphs } : {}),
  };
}

function parseRegion(
  raw: unknown,
  path: string,
  splitNestRemaining: number,
): JsonSlideRegion | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return err(`${path} must be an object`);
  }
  const kind = raw.kind;
  if (kind === 'card') {
    const card = parseCard(raw.card, `${path}.card`);
    if ('ok' in card && card.ok === false) {
      return card;
    }
    return { kind: 'card', card: card as JsonSlideCard };
  }
  if (kind === 'layout') {
    const layout = parseLayout(raw.layout, splitNestRemaining, `${path}.layout`);
    if ('ok' in layout && layout.ok === false) {
      return layout;
    }
    return { kind: 'layout', layout: layout as JsonSlideLayout };
  }
  if (kind === 'quote') {
    const quote = parseQuote(raw.quote, `${path}.quote`);
    if (typeof quote === 'object' && quote !== null && 'ok' in quote && quote.ok === false) {
      return quote;
    }
    return { kind: 'quote', quote: quote as JsonSlideQuote };
  }
  if (kind === 'text') {
    const textPayload = parseTextRegionPayload(raw.text, `${path}.text`);
    if (typeof textPayload === 'object' && textPayload !== null && 'ok' in textPayload && textPayload.ok === false) {
      return textPayload;
    }
    return { kind: 'text', text: textPayload as JsonSlideTextRegionPayload };
  }
  return err(`${path}.kind must be card, layout, quote, or text`);
}

export function parseLayout(
  raw: unknown,
  splitNestRemaining: number = SPLIT_LAYOUT_MAX_DEPTH,
  pathPrefix: string = 'layout',
): JsonSlideLayout | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return err(`${pathPrefix} must be an object`);
  }
  const type = raw.type;
  if (
    type !== 'asymmetricColumns' &&
    type !== 'equalColumns' &&
    type !== 'bentoGrid' &&
    type !== 'uniformGrid' &&
    type !== 'splitLayout' &&
    type !== 'stackLayout' &&
    type !== 'mediaGallery'
  ) {
    return err(
      `${pathPrefix}.type must be asymmetricColumns, equalColumns, bentoGrid, uniformGrid, splitLayout, stackLayout, or mediaGallery`,
    );
  }

  let gap: JsonSlideGridGap | undefined;
  if (raw.gap !== undefined) {
    if (typeof raw.gap !== 'string' || !GRID_GAPS.has(raw.gap as JsonSlideGridGap)) {
      return err(`${pathPrefix}.gap must be xs, sm, md, or lg`);
    }
    gap = raw.gap as JsonSlideGridGap;
  }

  let decorations: JsonSlideLayoutDecoration[] | undefined;
  if (raw.decorations !== undefined) {
    const decParsed = parseLayoutDecorations(raw.decorations, `${pathPrefix}.decorations`);
    if (typeof decParsed === 'object' && decParsed !== null && 'ok' in decParsed && decParsed.ok === false) {
      return decParsed;
    }
    const decList = decParsed as JsonSlideLayoutDecoration[];
    if (decList.length > 0) {
      decorations = decList;
    }
  }

  function finalize<L extends JsonSlideLayout>(layout: L): L {
    if (!decorations?.length) {
      return layout;
    }
    return { ...layout, decorations };
  }

  if (type === 'stackLayout') {
    const items = parseStackItems(raw.items, `${pathPrefix}.items`, splitNestRemaining);
    if ('ok' in items && items.ok === false) {
      return items;
    }
    return finalize({
      type: 'stackLayout',
      ...(gap !== undefined ? { gap } : {}),
      items: items as JsonSlideStackItem[],
    });
  }

  if (type === 'splitLayout') {
    if (splitNestRemaining <= 0) {
      return err(`${pathPrefix}: splitLayout exceeds maximum nesting depth (${SPLIT_LAYOUT_MAX_DEPTH})`);
    }
    const leftSpan = raw.leftSpan;
    const rightSpan = raw.rightSpan;
    if (typeof leftSpan !== 'number' || !Number.isInteger(leftSpan) || leftSpan < 1 || leftSpan > 11) {
      return err(`${pathPrefix}.leftSpan must be an integer 1–11`);
    }
    if (typeof rightSpan !== 'number' || !Number.isInteger(rightSpan) || rightSpan < 1 || rightSpan > 11) {
      return err(`${pathPrefix}.rightSpan must be an integer 1–11`);
    }
    if (leftSpan + rightSpan !== 12) {
      return err(`${pathPrefix}.leftSpan + rightSpan must equal 12 (got ${leftSpan + rightSpan})`);
    }
    const nextNest = splitNestRemaining - 1;
    const left = parseRegion(raw.left, `${pathPrefix}.left`, nextNest);
    if ('ok' in left && left.ok === false) {
      return left;
    }
    const right = parseRegion(raw.right, `${pathPrefix}.right`, nextNest);
    if ('ok' in right && right.ok === false) {
      return right;
    }
    return finalize({
      type: 'splitLayout',
      ...(gap !== undefined ? { gap } : {}),
      leftSpan,
      rightSpan,
      left: left as JsonSlideRegion,
      right: right as JsonSlideRegion,
    });
  }

  if (type === 'asymmetricColumns' || type === 'equalColumns') {
    const items = parseColumnItems(raw.items, `${pathPrefix}.items`, splitNestRemaining);
    if ('ok' in items && items.ok === false) {
      return items;
    }
    const list = items as JsonSlideColumnItem[];
    const sum = list.reduce((s, it) => s + it.span, 0);
    if (sum !== 12) {
      return err(`layout column spans must sum to 12 (got ${sum})`);
    }
    if (type === 'equalColumns') {
      const first = list[0].span;
      const allEqual = list.every((it) => it.span === first);
      if (!allEqual) {
        return err('equalColumns requires all items to have the same span');
      }
    }
    if (type === 'asymmetricColumns') {
      return finalize({
        type: 'asymmetricColumns',
        ...(gap !== undefined ? { gap } : {}),
        items: list,
      });
    }
    return finalize({
      type: 'equalColumns',
      ...(gap !== undefined ? { gap } : {}),
      items: list,
    });
  }

  if (type === 'uniformGrid') {
    const columns = raw.columns;
    if (typeof columns !== 'number' || !Number.isInteger(columns) || columns < 2 || columns > 12) {
      return err(`${pathPrefix}.columns must be an integer 2–12`);
    }
    const items = parseUniformGridCardItems(raw.items, `${pathPrefix}.items`);
    if ('ok' in items && items.ok === false) {
      return items;
    }
    return finalize({
      type: 'uniformGrid',
      columns,
      ...(gap !== undefined ? { gap } : {}),
      items: items as JsonSlideCard[],
    });
  }

  if (type === 'mediaGallery') {
    const items = parseMediaGalleryItems(raw.items, `${pathPrefix}.items`);
    if ('ok' in items && items.ok === false) {
      return items;
    }
    const list = items as JsonSlideMediaGalleryItem[];
    const count = list.length;

    let preset: JsonSlideMediaGalleryPreset | undefined;
    if (raw.preset !== undefined) {
      if (typeof raw.preset !== 'string' || !MEDIA_GALLERY_PRESETS.has(raw.preset as JsonSlideMediaGalleryPreset)) {
        return err(`${pathPrefix}.preset must be single, pair, row, column, or auto when present`);
      }
      preset = raw.preset as JsonSlideMediaGalleryPreset;
    }

    let rowJustify: JsonSlideMediaRowJustify | undefined;
    if (raw.rowJustify !== undefined) {
      if (
        typeof raw.rowJustify !== 'string' ||
        !MEDIA_ROW_JUSTIFIES.has(raw.rowJustify as JsonSlideMediaRowJustify)
      ) {
        return err(`${pathPrefix}.rowJustify must be start or end when present`);
      }
      rowJustify = raw.rowJustify as JsonSlideMediaRowJustify;
    }

    let cellVariant: JsonSlideMediaGalleryCellVariant | undefined;
    if (raw.cellVariant !== undefined) {
      if (
        typeof raw.cellVariant !== 'string' ||
        !MEDIA_GALLERY_CELL_VARIANTS.has(raw.cellVariant as JsonSlideMediaGalleryCellVariant)
      ) {
        return err(`${pathPrefix}.cellVariant must be panel or fill when present`);
      }
      cellVariant = raw.cellVariant as JsonSlideMediaGalleryCellVariant;
    }

    let verticalAlign: JsonSlideMediaGalleryVerticalAlign | undefined;
    if (raw.verticalAlign !== undefined) {
      if (
        typeof raw.verticalAlign !== 'string' ||
        !MEDIA_GALLERY_VERTICAL_ALIGNS.has(raw.verticalAlign as JsonSlideMediaGalleryVerticalAlign)
      ) {
        return err(`${pathPrefix}.verticalAlign must be top, center, or bottom when present`);
      }
      verticalAlign = raw.verticalAlign as JsonSlideMediaGalleryVerticalAlign;
    }

    const effectivePreset: JsonSlideMediaGalleryPreset | 'auto' = preset ?? 'auto';
    if (effectivePreset === 'single' && count !== 1) {
      return err(`${pathPrefix} with preset "single" requires exactly 1 media item (got ${count})`);
    }
    if (effectivePreset === 'pair' && count !== 2) {
      return err(`${pathPrefix} with preset "pair" requires exactly 2 media items (got ${count})`);
    }
    if (effectivePreset === 'row' && count < 1) {
      return err(`${pathPrefix} with preset "row" requires at least 1 media item`);
    }
    if (effectivePreset === 'column' && count < 1) {
      return err(`${pathPrefix} with preset "column" requires at least 1 media item`);
    }

    if (rowJustify !== undefined && (effectivePreset === 'single' || effectivePreset === 'column')) {
      return err(`${pathPrefix}.rowJustify is only used with preset "pair" or "row"`);
    }

    const layout: JsonSlideMediaGalleryLayout = {
      type: 'mediaGallery',
      ...(gap !== undefined ? { gap } : {}),
      items: list,
    };
    if (preset !== undefined && preset !== 'auto') {
      layout.preset = preset;
    }
    if (rowJustify !== undefined) {
      layout.rowJustify = rowJustify;
    }
    if (cellVariant !== undefined) {
      layout.cellVariant = cellVariant;
    }
    if (verticalAlign !== undefined) {
      layout.verticalAlign = verticalAlign;
    }
    return finalize(layout);
  }

  const columns = raw.columns;
  const rows = raw.rows;
  if (typeof columns !== 'number' || !Number.isInteger(columns) || columns < 2 || columns > 12) {
    return err(`${pathPrefix}.columns must be an integer 2–12`);
  }
  if (typeof rows !== 'number' || !Number.isInteger(rows) || rows < 2 || rows > 6) {
    return err(`${pathPrefix}.rows must be an integer 2–6`);
  }

  const items = parseBentoItems(raw.items, `${pathPrefix}.items`, columns, rows, splitNestRemaining);
  if ('ok' in items && items.ok === false) {
    return items;
  }

  return finalize({
    type: 'bentoGrid',
    columns,
    rows,
    ...(gap !== undefined ? { gap } : {}),
    items: items as JsonSlideBentoItem[],
  });
}
