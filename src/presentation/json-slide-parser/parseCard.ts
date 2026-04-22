import type {
  JsonSlideCard,
  JsonSlideCardHeaderBadge,
  JsonSlideCardHeaderBadgeTone,
  JsonSlideCardIconId,
  JsonSlideCardItem,
  JsonSlideCardItemFeatureList,
  JsonSlideCardItemText,
  JsonSlideCardItemVariant,
  JsonSlideCardJustify,
  JsonSlideCardPadding,
  JsonSlideCardSlot,
  JsonSlideCardSubtitle,
  JsonSlideCardSurface,
  JsonSlideCardTagListDirection,
  JsonSlideCardTagListVariant,
  JsonSlideCardTone,
  JsonSlideGridGap,
  JsonSlideTextRegionPayload,
} from '../jsonSlideTypes';
import { JSON_SLIDE_CARD_COMPONENT_IDS, JSON_SLIDE_CARD_ICON_IDS } from '../jsonSlideTypes';
import { err, GRID_GAPS, isRecord, parseString } from './parseUtils';

const CARD_TONES = new Set<JsonSlideCardTone>(['standard', 'accent']);
const CARD_PADDINGS = new Set<JsonSlideCardPadding>(['compact', 'default', 'spacious']);
const CARD_ITEM_VARIANTS = new Set<JsonSlideCardItemVariant>([
  'overline',
  'caption',
  'h2',
  'h3',
  'body',
  'bodyLg',
  'prompt',
]);

const CARD_ITEM_VARIANT_HINT =
  'overline, caption, h2, h3, body, bodyLg, prompt';
const CARD_JUSTIFY = new Set<JsonSlideCardJustify>(['start', 'end', 'between']);
const TAG_LIST_DIRECTIONS = new Set<JsonSlideCardTagListDirection>(['row', 'column']);
const TAG_LIST_VARIANTS = new Set<JsonSlideCardTagListVariant>(['default', 'compact']);
const CARD_SURFACES = new Set<JsonSlideCardSurface>(['box', 'ghost', 'accentGradient']);
const HEADER_BADGE_TONES = new Set<JsonSlideCardHeaderBadgeTone>(['default', 'accent', 'onAccent']);
const CARD_ICON_IDS = new Set<string>(JSON_SLIDE_CARD_ICON_IDS);
const CARD_ICON_ID_HINT = JSON_SLIDE_CARD_ICON_IDS.join(', ');
const CARD_COMPONENT_ID_HINT = JSON_SLIDE_CARD_COMPONENT_IDS.join(', ');
const TEXT_REGION_ALIGNS = new Set(['left', 'center', 'right']);

/**
 * Text rows only: same shape as card text `items[]`, but `type: "component"` is not allowed.
 */
function parseTextOnlyItems(raw: unknown, path: string): JsonSlideCardItemText[] | { ok: false; error: string } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return err(`${path} must be a non-empty array`);
  }
  const items: JsonSlideCardItemText[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const el = raw[i];
    if (!isRecord(el)) {
      return err(`${path}[${i}] must be an object`);
    }
    if (el.type === 'component') {
      return err(`${path}[${i}] type "component" is not allowed in text regions; use only text rows`);
    }
    const variantRaw = el.variant;
    if (typeof variantRaw !== 'string' || !CARD_ITEM_VARIANTS.has(variantRaw as JsonSlideCardItemVariant)) {
      return err(`${path}[${i}].variant must be one of: ${CARD_ITEM_VARIANT_HINT}`);
    }
    const variant = variantRaw as JsonSlideCardItemVariant;
    const textResult = parseString(el.text, `${path}[${i}].text`);
    if (typeof textResult === 'object' && 'ok' in textResult && textResult.ok === false) {
      return textResult;
    }
    const text = textResult as string;
    if (text.trim().length === 0) {
      return err(`${path}[${i}].text must be non-empty`);
    }
    items.push({ variant, text });
  }
  return items;
}

/**
 * `splitLayout` / `stackLayout` `kind: "text"` payload (not imageCover rails).
 */
export function parseTextRegionPayload(
  raw: unknown,
  path: string,
): JsonSlideTextRegionPayload | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return err(`${path} must be an object`);
  }

  const itemsParsed = parseTextOnlyItems(raw.items, `${path}.items`);
  if (typeof itemsParsed === 'object' && itemsParsed !== null && 'ok' in itemsParsed && itemsParsed.ok === false) {
    return itemsParsed;
  }
  const items = itemsParsed as JsonSlideCardItemText[];

  let stackGap: JsonSlideGridGap | undefined;
  if (raw.stackGap !== undefined) {
    if (typeof raw.stackGap !== 'string' || !GRID_GAPS.has(raw.stackGap as JsonSlideGridGap)) {
      return err(`${path}.stackGap must be xs, sm, md, or lg when present`);
    }
    stackGap = raw.stackGap as JsonSlideGridGap;
  }

  let align: JsonSlideTextRegionPayload['align'] | undefined;
  if (raw.align !== undefined) {
    if (typeof raw.align !== 'string' || !TEXT_REGION_ALIGNS.has(raw.align)) {
      return err(`${path}.align must be left, center, or right when present`);
    }
    align = raw.align as JsonSlideTextRegionPayload['align'];
  }

  return {
    items,
    ...(stackGap !== undefined ? { stackGap } : {}),
    ...(align !== undefined ? { align } : {}),
  };
}

function parseTagListComponentItem(
  el: Record<string, unknown>,
  path: string,
): JsonSlideCardItem | { ok: false; error: string } {
  let variant: JsonSlideCardTagListVariant | undefined;
  if (el.variant !== undefined) {
    if (typeof el.variant !== 'string' || !TAG_LIST_VARIANTS.has(el.variant as JsonSlideCardTagListVariant)) {
      return err(`${path}.variant must be default or compact when present`);
    }
    variant = el.variant as JsonSlideCardTagListVariant;
  }

  let direction: JsonSlideCardTagListDirection | undefined;
  if (el.direction !== undefined) {
    if (typeof el.direction !== 'string' || !TAG_LIST_DIRECTIONS.has(el.direction as JsonSlideCardTagListDirection)) {
      return err(`${path}.direction must be row or column when present`);
    }
    direction = el.direction as JsonSlideCardTagListDirection;
  }

  let gap: JsonSlideGridGap | undefined;
  if (el.gap !== undefined) {
    if (typeof el.gap !== 'string' || !GRID_GAPS.has(el.gap as JsonSlideGridGap)) {
      return err(`${path}.gap must be xs, sm, md, or lg when present`);
    }
    gap = el.gap as JsonSlideGridGap;
  }

  const rawList = el.items;
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return err(`${path}.items must be a non-empty array`);
  }

  const labelsSeen = new Set<string>();
  const tagItems: { label: string }[] = [];
  for (let j = 0; j < rawList.length; j += 1) {
    const row = rawList[j];
    if (!isRecord(row)) {
      return err(`${path}.items[${j}] must be an object`);
    }
    const labelResult = parseString(row.label, `${path}.items[${j}].label`);
    if (typeof labelResult === 'object' && 'ok' in labelResult && labelResult.ok === false) {
      return labelResult;
    }
    const label = labelResult as string;
    if (label.trim().length === 0) {
      return err(`${path}.items[${j}].label must be non-empty`);
    }
    if (labelsSeen.has(label)) {
      return err(`${path}.items[${j}].label duplicates an earlier tag label`);
    }
    labelsSeen.add(label);
    tagItems.push({ label });
  }

  return {
    type: 'component',
    component: 'tagList',
    ...(variant !== undefined ? { variant } : {}),
    ...(direction !== undefined ? { direction } : {}),
    ...(gap !== undefined ? { gap } : {}),
    items: tagItems,
  };
}

function parseIndexedListComponentItem(
  el: Record<string, unknown>,
  path: string,
): JsonSlideCardItem | { ok: false; error: string } {
  let gap: JsonSlideGridGap | undefined;
  if (el.gap !== undefined) {
    if (typeof el.gap !== 'string' || !GRID_GAPS.has(el.gap as JsonSlideGridGap)) {
      return err(`${path}.gap must be xs, sm, md, or lg when present`);
    }
    gap = el.gap as JsonSlideGridGap;
  }

  const rawList = el.items;
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return err(`${path}.items must be a non-empty array`);
  }

  const indicesSeen = new Set<number>();
  const rows: { index: number; title: string; subtitle?: string }[] = [];
  for (let j = 0; j < rawList.length; j += 1) {
    const row = rawList[j];
    if (!isRecord(row)) {
      return err(`${path}.items[${j}] must be an object`);
    }
    const idxRaw = row.index;
    if (typeof idxRaw !== 'number' || !Number.isInteger(idxRaw) || idxRaw < 0) {
      return err(`${path}.items[${j}].index must be a non-negative integer`);
    }
    if (indicesSeen.has(idxRaw)) {
      return err(`${path}.items[${j}].index duplicates an earlier row`);
    }
    indicesSeen.add(idxRaw);

    const titleResult = parseString(row.title, `${path}.items[${j}].title`);
    if (typeof titleResult === 'object' && 'ok' in titleResult && titleResult.ok === false) {
      return titleResult;
    }
    const title = titleResult as string;
    if (title.trim().length === 0) {
      return err(`${path}.items[${j}].title must be non-empty`);
    }

    if (row.subtitle === undefined) {
      rows.push({ index: idxRaw, title });
      continue;
    }

    const subResult = parseString(row.subtitle, `${path}.items[${j}].subtitle`);
    if (typeof subResult === 'object' && 'ok' in subResult && subResult.ok === false) {
      return subResult;
    }
    const subtitle = subResult as string;
    if (subtitle.trim().length === 0) {
      return err(`${path}.items[${j}].subtitle must be non-empty when present`);
    }

    rows.push({ index: idxRaw, title, subtitle });
  }

  return {
    type: 'component',
    component: 'indexedList',
    ...(gap !== undefined ? { gap } : {}),
    items: rows,
  };
}

function parseFeatureListComponentItem(
  el: Record<string, unknown>,
  path: string,
): JsonSlideCardItemFeatureList | { ok: false; error: string } {
  let gap: JsonSlideGridGap | undefined;
  if (el.gap !== undefined) {
    if (typeof el.gap !== 'string' || !GRID_GAPS.has(el.gap as JsonSlideGridGap)) {
      return err(`${path}.gap must be xs, sm, md, or lg when present`);
    }
    gap = el.gap as JsonSlideGridGap;
  }

  const rawList = el.items;
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return err(`${path}.items must be a non-empty array`);
  }

  const rows: { icon: JsonSlideCardIconId; label: string; value: string }[] = [];
  for (let j = 0; j < rawList.length; j += 1) {
    const row = rawList[j];
    if (!isRecord(row)) {
      return err(`${path}.items[${j}] must be an object`);
    }

    const iconRaw = row.icon;
    if (typeof iconRaw !== 'string' || !CARD_ICON_IDS.has(iconRaw)) {
      return err(`${path}.items[${j}].icon must be a known icon id (${CARD_ICON_ID_HINT})`);
    }

    const labelResult = parseString(row.label, `${path}.items[${j}].label`);
    if (typeof labelResult === 'object' && 'ok' in labelResult && labelResult.ok === false) {
      return labelResult;
    }
    const label = labelResult as string;
    if (label.trim().length === 0) {
      return err(`${path}.items[${j}].label must be non-empty`);
    }

    const valueResult = parseString(row.value, `${path}.items[${j}].value`);
    if (typeof valueResult === 'object' && 'ok' in valueResult && valueResult.ok === false) {
      return valueResult;
    }
    const value = valueResult as string;
    if (value.trim().length === 0) {
      return err(`${path}.items[${j}].value must be non-empty`);
    }

    rows.push({ icon: iconRaw as JsonSlideCardIconId, label, value });
  }

  return {
    type: 'component',
    component: 'featureList',
    ...(gap !== undefined ? { gap } : {}),
    items: rows,
  };
}

function parseComponentCardItem(
  el: Record<string, unknown>,
  path: string,
): JsonSlideCardItem | { ok: false; error: string } {
  const comp = el.component;
  if (comp === 'tagList') {
    return parseTagListComponentItem(el, path);
  }
  if (comp === 'indexedList') {
    return parseIndexedListComponentItem(el, path);
  }
  if (comp === 'featureList') {
    return parseFeatureListComponentItem(el, path);
  }
  return err(`${path}.component must be a registered id: ${CARD_COMPONENT_ID_HINT}`);
}

function parseCardItems(raw: unknown, path: string): JsonSlideCardItem[] | { ok: false; error: string } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return err(`${path} must be a non-empty array`);
  }
  const items: JsonSlideCardItem[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const el = raw[i];
    if (!isRecord(el)) {
      return err(`${path}[${i}] must be an object`);
    }
    if (el.type === 'component') {
      const compItem = parseComponentCardItem(el, `${path}[${i}]`);
      if (typeof compItem === 'object' && compItem !== null && 'ok' in compItem && compItem.ok === false) {
        return compItem;
      }
      items.push(compItem as JsonSlideCardItem);
      continue;
    }

    const variantRaw = el.variant;
    if (typeof variantRaw !== 'string' || !CARD_ITEM_VARIANTS.has(variantRaw as JsonSlideCardItemVariant)) {
      return err(`${path}[${i}].variant must be one of: ${CARD_ITEM_VARIANT_HINT}`);
    }
    const variant = variantRaw as JsonSlideCardItemVariant;
    const textResult = parseString(el.text, `${path}[${i}].text`);
    if (typeof textResult === 'object' && 'ok' in textResult && textResult.ok === false) {
      return textResult;
    }
    const text = textResult as string;
    if (text.trim().length === 0) {
      return err(`${path}[${i}].text must be non-empty`);
    }
    items.push({ variant, text });
  }
  return items;
}

function parseOptionalCardIconId(
  raw: unknown,
  path: string,
): JsonSlideCardIconId | undefined | { ok: false; error: string } {
  if (raw === undefined) {
    return undefined;
  }
  if (typeof raw !== 'string' || !CARD_ICON_IDS.has(raw)) {
    return err(`${path} must be a known icon id (${CARD_ICON_ID_HINT})`);
  }
  return raw as JsonSlideCardIconId;
}

function parseCardSubtitle(
  raw: unknown,
  path: string,
): JsonSlideCardSubtitle | undefined | { ok: false; error: string } {
  if (raw === undefined) {
    return undefined;
  }
  if (!isRecord(raw)) {
    return err(`${path} must be an object`);
  }
  const variantRaw = raw.variant !== undefined ? raw.variant : raw.type;
  if (typeof variantRaw !== 'string' || !CARD_ITEM_VARIANTS.has(variantRaw as JsonSlideCardItemVariant)) {
    return err(`${path}.variant must be one of: ${CARD_ITEM_VARIANT_HINT} (legacy key: type)`);
  }
  const variant = variantRaw as JsonSlideCardItemVariant;
  const textResult = parseString(raw.text, `${path}.text`);
  if (typeof textResult === 'object' && 'ok' in textResult && textResult.ok === false) {
    return textResult;
  }
  const text = textResult as string;
  if (text.trim().length === 0) {
    return err(`${path}.text must be non-empty`);
  }
  return { variant, text };
}

function parseHeaderBadge(
  raw: unknown,
  path: string,
): JsonSlideCardHeaderBadge | undefined | { ok: false; error: string } {
  if (raw === undefined) {
    return undefined;
  }
  if (!isRecord(raw)) {
    return err(`${path} must be an object`);
  }
  const textResult = parseString(raw.text, `${path}.text`);
  if (typeof textResult === 'object' && 'ok' in textResult && textResult.ok === false) {
    return textResult;
  }
  const text = textResult as string;
  if (text.trim().length === 0) {
    return err(`${path}.text must be non-empty`);
  }

  let tone: JsonSlideCardHeaderBadgeTone | undefined;
  if (raw.tone !== undefined) {
    if (typeof raw.tone !== 'string' || !HEADER_BADGE_TONES.has(raw.tone as JsonSlideCardHeaderBadgeTone)) {
      return err(`${path}.tone must be default, accent, or onAccent when present`);
    }
    tone = raw.tone as JsonSlideCardHeaderBadgeTone;
  }

  return { text, ...(tone !== undefined ? { tone } : {}) };
}

export function parseCard(raw: unknown, path: string): JsonSlideCard | { ok: false; error: string } {
  if (!isRecord(raw)) {
    return err(`${path} must be an object`);
  }
  const toneRaw = raw.tone;
  if (typeof toneRaw !== 'string' || !CARD_TONES.has(toneRaw as JsonSlideCardTone)) {
    return err(`${path}.tone must be "standard" or "accent"`);
  }
  const tone = toneRaw as JsonSlideCardTone;

  let surface: JsonSlideCardSurface | undefined;
  if (raw.surface !== undefined) {
    if (typeof raw.surface !== 'string' || !CARD_SURFACES.has(raw.surface as JsonSlideCardSurface)) {
      return err(`${path}.surface must be box, ghost, or accentGradient`);
    }
    surface = raw.surface as JsonSlideCardSurface;
  }

  const headerBadge = parseHeaderBadge(raw.headerBadge, `${path}.headerBadge`);
  if (typeof headerBadge === 'object' && headerBadge !== null && 'ok' in headerBadge && headerBadge.ok === false) {
    return headerBadge;
  }

  let padding: JsonSlideCardPadding | undefined;
  if (raw.padding !== undefined) {
    if (typeof raw.padding !== 'string' || !CARD_PADDINGS.has(raw.padding as JsonSlideCardPadding)) {
      return err(`${path}.padding must be compact, default, or spacious`);
    }
    padding = raw.padding as JsonSlideCardPadding;
  }

  let justify: JsonSlideCardJustify | undefined;
  if (raw.justify !== undefined) {
    if (typeof raw.justify !== 'string' || !CARD_JUSTIFY.has(raw.justify as JsonSlideCardJustify)) {
      return err(`${path}.justify must be start, end, or between`);
    }
    justify = raw.justify as JsonSlideCardJustify;
  }

  let stackGap: JsonSlideGridGap | undefined;
  if (raw.stackGap !== undefined) {
    if (typeof raw.stackGap !== 'string' || !GRID_GAPS.has(raw.stackGap as JsonSlideGridGap)) {
      return err(`${path}.stackGap must be xs, sm, md, or lg`);
    }
    stackGap = raw.stackGap as JsonSlideGridGap;
  }

  const subtitle = parseCardSubtitle(raw.subtitle, `${path}.subtitle`);
  if (typeof subtitle === 'object' && subtitle !== null && 'ok' in subtitle && subtitle.ok === false) {
    return subtitle;
  }

  const leadingIcon = parseOptionalCardIconId(raw.leadingIcon, `${path}.leadingIcon`);
  if (typeof leadingIcon === 'object' && leadingIcon !== null && 'ok' in leadingIcon && leadingIcon.ok === false) {
    return leadingIcon;
  }

  const watermarkIcon = parseOptionalCardIconId(raw.watermarkIcon, `${path}.watermarkIcon`);
  if (
    typeof watermarkIcon === 'object' &&
    watermarkIcon !== null &&
    'ok' in watermarkIcon &&
    watermarkIcon.ok === false
  ) {
    return watermarkIcon;
  }

  const hasSlots = raw.slots !== undefined;
  const hasItems = raw.items !== undefined;
  if (hasSlots && hasItems) {
    return err(`${path} must use either "items" or "slots", not both`);
  }
  if (!hasSlots && !hasItems) {
    return err(`${path} must include "items" or "slots"`);
  }

  let items: JsonSlideCardItem[] | undefined;
  let slots: JsonSlideCardSlot[] | undefined;

  if (hasSlots) {
    const slotsParsed = parseCardSlots(raw.slots, `${path}.slots`);
    if (typeof slotsParsed === 'object' && slotsParsed !== null && 'ok' in slotsParsed && slotsParsed.ok === false) {
      return slotsParsed;
    }
    slots = slotsParsed as JsonSlideCardSlot[];
  } else {
    const itemsParsed = parseCardItems(raw.items, `${path}.items`);
    if (typeof itemsParsed === 'object' && itemsParsed !== null && 'ok' in itemsParsed && itemsParsed.ok === false) {
      return itemsParsed;
    }
    items = itemsParsed as JsonSlideCardItem[];
  }

  return {
    tone,
    surface,
    headerBadge: headerBadge as JsonSlideCardHeaderBadge | undefined,
    padding,
    stackGap,
    leadingIcon: leadingIcon as JsonSlideCardIconId | undefined,
    watermarkIcon: watermarkIcon as JsonSlideCardIconId | undefined,
    subtitle: subtitle as JsonSlideCardSubtitle | undefined,
    justify,
    ...(items !== undefined ? { items } : {}),
    ...(slots !== undefined ? { slots } : {}),
  };
}

function parseCardSlots(raw: unknown, path: string): JsonSlideCardSlot[] | { ok: false; error: string } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return err(`${path} must be a non-empty array`);
  }
  const slots: JsonSlideCardSlot[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const el = raw[i];
    if (!isRecord(el)) {
      return err(`${path}[${i}] must be an object`);
    }
    const innerItems = parseCardItems(el.items, `${path}[${i}].items`);
    if (typeof innerItems === 'object' && innerItems !== null && 'ok' in innerItems && innerItems.ok === false) {
      return innerItems;
    }
    let gap: JsonSlideGridGap | undefined;
    if (el.gap !== undefined) {
      if (typeof el.gap !== 'string' || !GRID_GAPS.has(el.gap as JsonSlideGridGap)) {
        return err(`${path}[${i}].gap must be xs, sm, md, or lg when present`);
      }
      gap = el.gap as JsonSlideGridGap;
    }
    slots.push({
      items: innerItems as JsonSlideCardItem[],
      ...(gap !== undefined ? { gap } : {}),
    });
  }
  return slots;
}
