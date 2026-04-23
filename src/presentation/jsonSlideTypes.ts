import type { SlideTheme } from './types';

/** JSON slide document: declarative contract, not DOM. */

export type JsonSlideFrameAlign = 'top' | 'center' | 'bottom';
export type JsonSlideFramePadding = 'compact' | 'default' | 'spacious';

export type JsonSlideBackdropVariant = 'grid' | 'mesh' | 'spotlight' | 'none';

export type JsonSlideContentWidth = 'full' | 'wide' | 'content' | 'narrow';
export type JsonSlideContentDensity = 'compact' | 'comfortable' | 'relaxed';
export type JsonSlideContentAlign = 'left' | 'center';

export type JsonSlideGridGap = 'xs' | 'sm' | 'md' | 'lg';

export type JsonSlideCardTone = 'standard' | 'accent';
export type JsonSlideCardPadding = 'compact' | 'default' | 'spacious';

/** Subset of `Text` variants allowed inside JSON card `items`. */
export type JsonSlideCardItemVariant =
  | 'overline'
  | 'caption'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyLg'
  | 'prompt';

/** Text row inside a card — backward compatible; `type` не обязателен. */
export interface JsonSlideCardItemText {
  variant: JsonSlideCardItemVariant;
  text: string;
}

/** Allowlist id для `type: "component"` items (см. `jsonSlideCardComponentRegistry.tsx`). */
export const JSON_SLIDE_CARD_COMPONENT_IDS = ['tagList', 'indexedList', 'featureList'] as const;

export type JsonSlideCardComponentId = (typeof JSON_SLIDE_CARD_COMPONENT_IDS)[number];

export type JsonSlideCardTagListDirection = 'row' | 'column';

/** `compact`: pill tags with tighter padding (e.g. ghost grid cards on prompt-structure). */
export type JsonSlideCardTagListVariant = 'default' | 'compact';

export interface JsonSlideCardItemTagList {
  type: 'component';
  component: 'tagList';
  variant?: JsonSlideCardTagListVariant;
  direction?: JsonSlideCardTagListDirection;
  gap?: JsonSlideGridGap;
  items: { label: string }[];
}

export interface JsonSlideCardItemIndexedList {
  type: 'component';
  component: 'indexedList';
  gap?: JsonSlideGridGap;
  items: { index: number; title: string; subtitle?: string }[];
}

export interface JsonSlideCardItemFeatureList {
  type: 'component';
  component: 'featureList';
  gap?: JsonSlideGridGap;
  items: { icon: JsonSlideCardIconId; label: string; value: string }[];
}

export type JsonSlideCardItem =
  | JsonSlideCardItemText
  | JsonSlideCardItemTagList
  | JsonSlideCardItemIndexedList
  | JsonSlideCardItemFeatureList;

export function isJsonSlideCardItemTagList(item: JsonSlideCardItem): item is JsonSlideCardItemTagList {
  return 'type' in item && item.type === 'component' && item.component === 'tagList';
}

export function isJsonSlideCardItemIndexedList(item: JsonSlideCardItem): item is JsonSlideCardItemIndexedList {
  return 'type' in item && item.type === 'component' && item.component === 'indexedList';
}

export function isJsonSlideCardItemFeatureList(item: JsonSlideCardItem): item is JsonSlideCardItemFeatureList {
  return 'type' in item && item.type === 'component' && item.component === 'featureList';
}

export function isJsonSlideCardItemText(item: JsonSlideCardItem): item is JsonSlideCardItemText {
  return !('type' in item && item.type === 'component');
}

/**
 * Vertical distribution of the card body stack (flex main axis).
 * With `slots`, `justify` applies between slots; items inside a slot stay glued by `gap`.
 * Legacy flat `items`: `headerBadge` + leading `overline`+`h2` triggers a header-pair heuristic where `between` splits space between header row and the rest.
 */
export type JsonSlideCardJustify = 'start' | 'end' | 'between';

/**
 * Indivisible vertical block inside a card. Items inside are separated by `gap` (or card `stackGap`);
 * outer `justify` distributes whole slots. Prefer `slots` over flat `items` when you need
 * `justify: "between"` to pin top/bottom groups.
 */
export interface JsonSlideCardSlot {
  items: JsonSlideCardItem[];
  /** Gap between items inside this slot. Defaults to card-level `stackGap`. */
  gap?: JsonSlideGridGap;
}

/** Pinned top zone; same `variant` + `text` shape as a text `items[]` row; does not participate in `justify`. */
export type JsonSlideCardSubtitle = JsonSlideCardItemText;

/** Container look; orthogonal to semantic `tone` (text / onAccent). */
export type JsonSlideCardSurface = 'box' | 'ghost' | 'accentGradient';

export type JsonSlideCardHeaderBadgeTone = 'default' | 'accent' | 'onAccent';

export interface JsonSlideCardHeaderBadge {
  text: string;
  tone?: JsonSlideCardHeaderBadgeTone;
}

/** Allowed keys for `leadingIcon` / `watermarkIcon` / `featureList` row icons; resolved in `json-renderer/jsonSlideCardIconRegistry.tsx`. */
export const JSON_SLIDE_CARD_ICON_IDS = [
  'gemini',
  'byte-dance',
  'flux',
  'grok',
  'midjourney',
  'openai',
  'volcengine',
  'clapperboard',
  'workflow',
  'palette',
  'video',
  'image',
  'layout-template',
  'pen-tool',
  'sparkles',
  'bar-chart-3',
  'type',
  'layers',
  'share-2',
  'zap',
  'monitor',
  'globe',
  'brain',
  'bot',
  'cursor',
  'claude',
  'claude-code',
  'replit',
  'lovable',
  'figma',
  'repeat',
  'clock',
  'users',
  'banknote',
  'circle-dollar-sign',
  'rocket',
] as const;

export type JsonSlideCardIconId = (typeof JSON_SLIDE_CARD_ICON_IDS)[number];

/** Decorative overlay on the layout area (out of flow); validated allowlist only. */
export type JsonSlideLayoutDecorationAnchor = 'center';

export type JsonSlideLayoutIconBadgeDecorationTone = 'surface' | 'accent';

export type JsonSlideLayoutIconBadgeDecorationSize = 'md' | 'lg' | 'xl';

export interface JsonSlideLayoutDecorationIconBadge {
  type: 'iconBadge';
  anchor: JsonSlideLayoutDecorationAnchor;
  icon: JsonSlideCardIconId;
  tone: JsonSlideLayoutIconBadgeDecorationTone;
  size: JsonSlideLayoutIconBadgeDecorationSize;
}

export type JsonSlideLayoutDecoration = JsonSlideLayoutDecorationIconBadge;

export interface JsonSlideFrame {
  align?: JsonSlideFrameAlign;
  padding?: JsonSlideFramePadding;
}

export interface JsonSlideBackdrop {
  variant?: JsonSlideBackdropVariant;
  /** Decorative border frame (see `SlideBackdropFrame`), e.g. on spotlight. */
  borderFrame?: boolean;
  /** Softer spotlight (legacy ~70% opacity on gradient). */
  dimmed?: boolean;
}

export interface JsonSlideContent {
  width?: JsonSlideContentWidth;
  density?: JsonSlideContentDensity;
  align?: JsonSlideContentAlign;
}

export type JsonSlideHeaderAlign = 'left' | 'center';

export interface JsonSlideHeader {
  meta: string;
  title?: string;
  lead?: string;
  align?: JsonSlideHeaderAlign;
}

export type JsonSlideMediaGalleryObjectAlign = 'left' | 'center' | 'right';
export type JsonSlideMediaGalleryObjectFit = 'contain' | 'cover';

/** `auto` and omit both preserve the legacy count-based grid rules. */
export type JsonSlideMediaGalleryPreset = 'single' | 'pair' | 'row' | 'column' | 'auto';

/** How gallery media sits in its cell: `panel` (default, centered contain) vs `fill` (legacy image cell: clip + cover). */
export type JsonSlideMediaGalleryCellVariant = 'panel' | 'fill';

export type JsonSlideMediaRowJustify = 'start' | 'end';

/** Left-column quote block; neutral name (not tied to the word "prompt"). */
export interface JsonSlideQuote {
  /** Top line, e.g. «Промпт» (preferred). */
  label?: string;
  /** Alternative top line if `label` is omitted. */
  subtitle?: string;
  /** Main quoted text. */
  text?: string;
  /** Optional multiple paragraphs; each is rendered as its own block. */
  paragraphs?: string[];
}

export interface JsonSlideMediaGalleryItemImage {
  type: 'image';
  src: string;
  alt?: string;
  caption?: string;
  showCaption?: boolean;
  objectAlign?: JsonSlideMediaGalleryObjectAlign;
  /** When `cellVariant` is `fill`, defaults to `cover`. */
  objectFit?: JsonSlideMediaGalleryObjectFit;
}

export interface JsonSlideMediaGalleryItemVideo {
  type: 'video';
  src: string;
  caption?: string;
  showCaption?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  objectFit?: JsonSlideMediaGalleryObjectFit;
}

export type JsonSlideMediaGalleryItem =
  | JsonSlideMediaGalleryItemImage
  | JsonSlideMediaGalleryItemVideo;

export type JsonSlideMediaGalleryVerticalAlign = 'top' | 'center' | 'bottom';

export interface JsonSlideMediaGalleryLayout {
  type: 'mediaGallery';
  gap?: JsonSlideGridGap;
  decorations?: JsonSlideLayoutDecoration[];
  /**
   * Layout mode. Omitted or `auto` keeps count-based columns (1 → 1 col, 2 → 2 col, 3 → 3 col, 4 → 2×2, 5+ → flex strip).
   */
  preset?: JsonSlideMediaGalleryPreset;
  /** Vertical alignment of media within each cell. Omitted = `center`. */
  verticalAlign?: JsonSlideMediaGalleryVerticalAlign;
  /** For `pair` and `row`: horizontal distribution (default `end`, matches `SlideImagePair`). */
  rowJustify?: JsonSlideMediaRowJustify;
  /**
   * `fill`: edge-to-edge clipped cells with rounded inner radius (legacy slide image tiles).
   * Omitted or `panel`: previous gallery look (contain / centered).
   */
  cellVariant?: JsonSlideMediaGalleryCellVariant;
  items: JsonSlideMediaGalleryItem[];
}

/** One row in a vertical stack; `span` values are fr weights (must sum to 12). */
export interface JsonSlideStackItem {
  span: number;
  region: JsonSlideRegion;
}

/** Vertical stack of regions (card, quote, text, or nested layout). */
export interface JsonSlideStackLayout {
  type: 'stackLayout';
  gap?: JsonSlideGridGap;
  decorations?: JsonSlideLayoutDecoration[];
  items: JsonSlideStackItem[];
}

export interface JsonSlideCard {
  tone: JsonSlideCardTone;
  padding?: JsonSlideCardPadding;
  /** Visual shell; default `box` matches legacy `Box`. */
  surface?: JsonSlideCardSurface;
  /** Optional circular index / label in the header row (with leading `overline` + `h2` when present). */
  headerBadge?: JsonSlideCardHeaderBadge;
  /** Vertical gap inside the card (icon / subtitle / items, and between items). Same vocabulary as `layout.gap`. */
  stackGap?: JsonSlideGridGap;
  /** Small icon in the top badge area (above subtitle / content). */
  leadingIcon?: JsonSlideCardIconId;
  /** Large corner watermark behind text. */
  watermarkIcon?: JsonSlideCardIconId;
  /** Optional label above content; always top; not affected by `justify`. */
  subtitle?: JsonSlideCardSubtitle;
  /** See `JsonSlideCardJustify`. Does not apply to `subtitle`. */
  justify?: JsonSlideCardJustify;
  /** Flat rows. Provide either `items` or `slots`, not both. */
  items?: JsonSlideCardItem[];
  /** Grouped rows; `justify` distributes slots, items within a slot stay glued. */
  slots?: JsonSlideCardSlot[];
}

export interface JsonSlideColumnItem {
  span: number;
  /** Same `JsonSlideRegion` as `splitLayout` / `stackLayout`: card, text, quote, or nested layout. */
  region: JsonSlideRegion;
}

export interface JsonSlideAsymmetricLayout {
  type: 'asymmetricColumns';
  gap?: JsonSlideGridGap;
  decorations?: JsonSlideLayoutDecoration[];
  items: JsonSlideColumnItem[];
}

export interface JsonSlideEqualLayout {
  type: 'equalColumns';
  gap?: JsonSlideGridGap;
  decorations?: JsonSlideLayoutDecoration[];
  items: JsonSlideColumnItem[];
}

export type JsonSlideBentoRegion =
  | { kind: 'card'; card: JsonSlideCard }
  | { kind: 'layout'; layout: JsonSlideLayout };

export interface JsonSlideBentoItem {
  colStart: number;
  rowStart: number;
  colSpan: number;
  rowSpan: number;
  region: JsonSlideBentoRegion;
}

export interface JsonSlideBentoLayout {
  type: 'bentoGrid';
  columns: number;
  rows: number;
  gap?: JsonSlideGridGap;
  decorations?: JsonSlideLayoutDecoration[];
  items: JsonSlideBentoItem[];
}

/** Repeatable row-major grid of cards (`columns` fixed; rows implicit). */
export interface JsonSlideUniformGridLayout {
  type: 'uniformGrid';
  columns: number;
  gap?: JsonSlideGridGap;
  decorations?: JsonSlideLayoutDecoration[];
  items: JsonSlideCard[];
}

/** Single split row: two regions that are either one card, quote, text block, or a nested layout. */
export interface JsonSlideSplitLayout {
  type: 'splitLayout';
  gap?: JsonSlideGridGap;
  decorations?: JsonSlideLayoutDecoration[];
  leftSpan: number;
  rightSpan: number;
  left: JsonSlideRegion;
  right: JsonSlideRegion;
}

/** Horizontal alignment of a plain `text` region in split/stack (not the same as imageCover rail `kind: "text"`). */
export type JsonSlideTextRegionAlign = 'left' | 'center' | 'right';

/**
 * Plain text stack for `splitLayout` / `stackLayout` regions — no card chrome, no `type: "component"` rows.
 * Same `items[]` text shape as in cards (including `prompt` for monospace prompt blocks).
 */
export interface JsonSlideTextRegionPayload {
  items: JsonSlideCardItemText[];
  stackGap?: JsonSlideGridGap;
  align?: JsonSlideTextRegionAlign;
}

export type JsonSlideRegion =
  | { kind: 'card'; card: JsonSlideCard }
  | { kind: 'layout'; layout: JsonSlideLayout }
  | { kind: 'quote'; quote: JsonSlideQuote }
  | { kind: 'text'; text: JsonSlideTextRegionPayload };

export type JsonSlideLayout =
  | JsonSlideAsymmetricLayout
  | JsonSlideEqualLayout
  | JsonSlideBentoLayout
  | JsonSlideUniformGridLayout
  | JsonSlideSplitLayout
  | JsonSlideStackLayout
  | JsonSlideMediaGalleryLayout;

// --- imageCover template (full-bleed image shell; not a layout `type`) ---

export type JsonImageCoverOverlay = 'none' | 'gradientPinkBottom' | 'gradientBg55' | 'gradientBg80';

export interface JsonImageCoverBackground {
  src: string;
  alt?: string;
  overlay: JsonImageCoverOverlay;
}

export type JsonImageCoverRailTextStyle = 'plain' | 'label' | 'inverted';

export interface JsonImageCoverRailText {
  kind: 'text';
  /** Lines; joined with <br /> in render */
  lines: string[];
  textAlign?: 'left' | 'center' | 'right';
  style?: JsonImageCoverRailTextStyle;
}

export type JsonImageCoverClusterGap = 'md' | 'lg';

export interface JsonImageCoverRailCluster {
  kind: 'cluster';
  gap: JsonImageCoverClusterGap;
  items: { lines: string[] }[];
}

export type JsonImageCoverRailItem = JsonImageCoverRailText | JsonImageCoverRailCluster;

export type JsonImageCoverRailRowVariant = 'two' | 'three';

export type JsonImageCoverRailTone = 'default' | 'inverted';

export interface JsonImageCoverRailRow {
  variant: JsonImageCoverRailRowVariant;
  /** Full-row look for top rail (e.g. white caps on texturing). Default is per-item `style`. */
  tone?: JsonImageCoverRailTone;
  items: [JsonImageCoverRailItem, JsonImageCoverRailItem] | [JsonImageCoverRailItem, JsonImageCoverRailItem, JsonImageCoverRailItem];
}

export type JsonImageCoverHeadlineBlockFont = 'display' | 'serif';
export type JsonImageCoverHeadlineBlockSize = 'jumbo' | 'mega' | 'display' | 'displayTight' | 'hero';

export type JsonImageCoverHeadlineColor = 'textSoft' | 'white' | 'gold';

export interface JsonImageCoverHeadlineBlock {
  /** May contain \\n; split render or single block with newlines (shell uses pre-line as needed) */
  text: string;
  font: JsonImageCoverHeadlineBlockFont;
  size: JsonImageCoverHeadlineBlockSize;
  italic?: boolean;
  color: JsonImageCoverHeadlineColor;
  weight?: 'normal' | 'semibold';
}

export type JsonImageCoverHeadlineStack = 'br' | 'tight' | 'none';

export interface JsonImageCoverHeadline {
  align: 'center';
  offsetYPx: 100 | 220 | 280;
  /** Visual separation between multiple headline blocks */
  stack: JsonImageCoverHeadlineStack;
  blocks: JsonImageCoverHeadlineBlock[];
}

export interface JsonImageCoverBottomRail {
  variant: 'three';
  items: [JsonImageCoverRailItem, JsonImageCoverRailItem, JsonImageCoverRailItem];
  /** Thin rule above the center column text (e.g. texturing cover) */
  centerAccent?: { type: 'rule' };
}

export interface JsonImageCover {
  background: JsonImageCoverBackground;
  /**
   * Decorative border frame; matches legacy `SlideBackdropFrame` on image covers.
   * Keep `true` for parity with migrated covers.
   */
  frame: boolean;
  topRail: JsonImageCoverRailRow;
  headline: JsonImageCoverHeadline;
  bottomRail: JsonImageCoverBottomRail;
}

/** Default JSON slide: standard shell + layout dispatch */
export interface JsonSlideDefaultDocument {
  template?: 'default';
  /** Optional: deck theme key; slide entry theme still wins for CSS vars. */
  theme?: SlideTheme;
  frame?: JsonSlideFrame;
  backdrop?: JsonSlideBackdrop;
  content?: JsonSlideContent;
  header: JsonSlideHeader;
  layout: JsonSlideLayout;
}

export interface JsonSlideImageCoverDocument {
  template: 'imageCover';
  theme?: SlideTheme;
  cover: JsonImageCover;
}

// --- textStack template ---

/** Text variant allowlist for textStack items (wider than card items; covers h1/lead for title slides). */
export type JsonSlideTextStackItemVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'lead'
  | 'body'
  | 'bodyLg'
  | 'caption'
  | 'overline'
  | 'prompt';

/** Only applies when variant is "h1". */
export type JsonSlideTextStackItemSize = 'display' | 'section' | 'compact';

export type JsonSlideTextStackItemContext = 'default' | 'onAccent';

export type JsonSlideTextStackTextChunkTone = 'default' | 'accent';

export type JsonSlideTextStackTextChunkDecoration = 'none' | 'lineThrough';

/** One inline run inside a `text` stack row when `chunks` is used. */
export interface JsonSlideTextStackTextChunk {
  text: string;
  /** Defaults to `default` (inherits parent `Text` color). */
  tone?: JsonSlideTextStackTextChunkTone;
  /** Defaults to `none`. */
  decoration?: JsonSlideTextStackTextChunkDecoration;
}

export interface JsonSlideTextStackItemTextBase {
  type: 'text';
  variant: JsonSlideTextStackItemVariant;
  /** Only allowed when variant is "h1". */
  size?: JsonSlideTextStackItemSize;
  context?: JsonSlideTextStackItemContext;
}

/** Plain one-line `text: string` (original contract). */
export interface JsonSlideTextStackItemTextPlain extends JsonSlideTextStackItemTextBase {
  text: string;
}

/** Rich line: `chunks` only; no `text` field. */
export interface JsonSlideTextStackItemTextChunked extends JsonSlideTextStackItemTextBase {
  chunks: [JsonSlideTextStackTextChunk, ...JsonSlideTextStackTextChunk[]];
}

export type JsonSlideTextStackItemText = JsonSlideTextStackItemTextPlain | JsonSlideTextStackItemTextChunked;

export interface JsonSlideTextStackItemLink {
  type: 'link';
  href: string;
  label: string;
}

export interface JsonSlideTextStackItemImage {
  type: 'image';
  src: string;
  alt?: string;
  /** Width in CSS pixels. */
  width: number;
  /** Height in CSS pixels. Omit to keep aspect ratio at the given `width`. */
  height?: number;
}

export type JsonSlideTextStackItem =
  | JsonSlideTextStackItemText
  | JsonSlideTextStackItemLink
  | JsonSlideTextStackItemImage;

export type JsonSlideTextStackAlign = 'left' | 'center' | 'right';
export type JsonSlideTextStackJustify = 'start' | 'center' | 'end';

export type JsonSlideTextStackRevealPreset = 'soft' | 'hero' | 'scale-in' | 'enter-up' | 'none';

export interface JsonSlideTextStackReveal {
  preset: JsonSlideTextStackRevealPreset;
  baseDelay?: number;
  step?: number;
}

export interface JsonSlideTextStack {
  align: JsonSlideTextStackAlign;
  justify: JsonSlideTextStackJustify;
  gap?: JsonSlideGridGap;
  reveal?: JsonSlideTextStackReveal;
  items: [JsonSlideTextStackItem, ...JsonSlideTextStackItem[]];
}

/** Headerless text-stack slide: vertical list of text, link, or image items, no layout dispatch. */
export interface JsonSlideTextStackDocument {
  template: 'textStack';
  theme?: SlideTheme;
  frame?: JsonSlideFrame;
  backdrop?: JsonSlideBackdrop;
  content?: JsonSlideContent;
  stack: JsonSlideTextStack;
}

export type JsonSlideDocument = JsonSlideDefaultDocument | JsonSlideImageCoverDocument | JsonSlideTextStackDocument;

export function isJsonSlideImageCoverDocument(
  doc: JsonSlideDocument,
): doc is JsonSlideImageCoverDocument {
  return doc.template === 'imageCover';
}

export function isJsonSlideTextStackDocument(
  doc: JsonSlideDocument,
): doc is JsonSlideTextStackDocument {
  return doc.template === 'textStack';
}
