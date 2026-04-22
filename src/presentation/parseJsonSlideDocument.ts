import type { SlideTheme } from './types';
import type {
  JsonSlideBackdrop,
  JsonSlideBackdropVariant,
  JsonSlideContent,
  JsonSlideContentAlign,
  JsonSlideContentDensity,
  JsonSlideContentWidth,
  JsonSlideDefaultDocument,
  JsonSlideDocument,
  JsonSlideFrame,
  JsonSlideFrameAlign,
  JsonSlideFramePadding,
  JsonSlideHeader,
  JsonSlideHeaderAlign,
  JsonSlideLayout,
} from './jsonSlideTypes';
import { err, isRecord, parseOptionalString, parseString } from './json-slide-parser/parseUtils';
import { parseImageCoverDocument } from './json-slide-parser/parseImageCover';
import { parseLayout, SPLIT_LAYOUT_MAX_DEPTH } from './json-slide-parser/parseRegionLayout';

export { SPLIT_LAYOUT_MAX_DEPTH };

const FRAME_ALIGNS = new Set<JsonSlideFrameAlign>(['top', 'center', 'bottom']);
const FRAME_PADDINGS = new Set<JsonSlideFramePadding>(['compact', 'default', 'spacious']);
const BACKDROP_VARIANTS = new Set<JsonSlideBackdropVariant>(['grid', 'mesh', 'spotlight', 'none']);
const CONTENT_WIDTHS = new Set<JsonSlideContentWidth>(['full', 'wide', 'content', 'narrow']);
const CONTENT_DENSITIES = new Set<JsonSlideContentDensity>(['compact', 'comfortable', 'relaxed']);
const CONTENT_ALIGNS = new Set<JsonSlideContentAlign>(['left', 'center']);
const HEADER_ALIGNS = new Set<JsonSlideHeaderAlign>(['left', 'center']);
const THEMES = new Set<SlideTheme>(['editorial', 'signal', 'cinema']);

export type ParseJsonSlideResult =
  | { ok: true; doc: JsonSlideDocument }
  | { ok: false; error: string };

export function parseJsonSlideDocument(raw: unknown): ParseJsonSlideResult {
  if (!isRecord(raw)) {
    return err('Root must be an object');
  }

  if (raw.template === 'imageCover') {
    if (raw.header !== undefined) {
      return err('imageCover document must not include header; use cover rails instead');
    }
    if (raw.layout !== undefined) {
      return err('imageCover document must not include layout');
    }
    if (raw.frame !== undefined) {
      return err('imageCover document must not include frame; cover.frame controls the decorative border');
    }
    if (raw.backdrop !== undefined) {
      return err('imageCover document must not include backdrop; use cover.background');
    }
    if (raw.content !== undefined) {
      return err('imageCover document must not include content');
    }
    return parseImageCoverDocument(raw);
  }

  if (raw.template !== undefined && raw.template !== 'default') {
    return err('template must be default when present on a layout document');
  }

  if (raw.theme !== undefined) {
    if (typeof raw.theme !== 'string' || !THEMES.has(raw.theme as SlideTheme)) {
      return err('theme must be editorial, signal, or cinema when present');
    }
  }

  let frame: JsonSlideFrame | undefined;
  if (raw.frame !== undefined) {
    if (!isRecord(raw.frame)) {
      return err('frame must be an object');
    }
    const f = raw.frame;
    if (f.align !== undefined && (typeof f.align !== 'string' || !FRAME_ALIGNS.has(f.align as JsonSlideFrameAlign))) {
      return err('frame.align must be top, center, or bottom');
    }
    if (
      f.padding !== undefined &&
      (typeof f.padding !== 'string' || !FRAME_PADDINGS.has(f.padding as JsonSlideFramePadding))
    ) {
      return err('frame.padding must be compact, default, or spacious');
    }
    frame = {
      align: f.align as JsonSlideFrameAlign | undefined,
      padding: f.padding as JsonSlideFramePadding | undefined,
    };
  }

  let backdrop: JsonSlideBackdrop | undefined;
  if (raw.backdrop !== undefined) {
    if (!isRecord(raw.backdrop)) {
      return err('backdrop must be an object');
    }
    const b = raw.backdrop;
    if (
      b.variant !== undefined &&
      (typeof b.variant !== 'string' || !BACKDROP_VARIANTS.has(b.variant as JsonSlideBackdropVariant))
    ) {
      return err('backdrop.variant must be grid, mesh, spotlight, or none');
    }
    if (b.borderFrame !== undefined && typeof b.borderFrame !== 'boolean') {
      return err('backdrop.borderFrame must be a boolean when present');
    }
    if (b.dimmed !== undefined && typeof b.dimmed !== 'boolean') {
      return err('backdrop.dimmed must be a boolean when present');
    }
    backdrop = {
      variant: b.variant as JsonSlideBackdropVariant | undefined,
      ...(b.borderFrame === true ? { borderFrame: true } : {}),
      ...(b.dimmed === true ? { dimmed: true } : {}),
    };
  }

  let content: JsonSlideContent | undefined;
  if (raw.content !== undefined) {
    if (!isRecord(raw.content)) {
      return err('content must be an object');
    }
    const c = raw.content;
    if (c.width !== undefined && (typeof c.width !== 'string' || !CONTENT_WIDTHS.has(c.width as JsonSlideContentWidth))) {
      return err('content.width must be full, wide, content, or narrow');
    }
    if (
      c.density !== undefined &&
      (typeof c.density !== 'string' || !CONTENT_DENSITIES.has(c.density as JsonSlideContentDensity))
    ) {
      return err('content.density must be compact, comfortable, or relaxed');
    }
    if (c.align !== undefined && (typeof c.align !== 'string' || !CONTENT_ALIGNS.has(c.align as JsonSlideContentAlign))) {
      return err('content.align must be left or center');
    }
    content = {
      width: c.width as JsonSlideContentWidth | undefined,
      density: c.density as JsonSlideContentDensity | undefined,
      align: c.align as JsonSlideContentAlign | undefined,
    };
  }

  if (!isRecord(raw.header)) {
    return err('header must be an object');
  }
  const metaResult = parseString(raw.header.meta, 'header.meta');
  if (typeof metaResult === 'object' && 'ok' in metaResult) {
    return metaResult;
  }
  const titleResult = parseOptionalString(raw.header.title, 'header.title');
  if (typeof titleResult === 'object' && titleResult !== null && 'ok' in titleResult && titleResult.ok === false) {
    return titleResult;
  }
  const leadResult = parseOptionalString(raw.header.lead, 'header.lead');
  if (typeof leadResult === 'object' && leadResult !== null && 'ok' in leadResult && leadResult.ok === false) {
    return leadResult;
  }

  let headerAlign: JsonSlideHeaderAlign | undefined;
  if (raw.header.align !== undefined) {
    if (typeof raw.header.align !== 'string' || !HEADER_ALIGNS.has(raw.header.align as JsonSlideHeaderAlign)) {
      return err('header.align must be left or center when present');
    }
    headerAlign = raw.header.align as JsonSlideHeaderAlign;
  }

  const header: JsonSlideHeader = {
    meta: metaResult as string,
    ...(titleResult != null && (titleResult as string).length > 0 ? { title: titleResult as string } : {}),
    lead: leadResult as string | undefined,
    ...(headerAlign !== undefined ? { align: headerAlign } : {}),
  };

  const layout = parseLayout(raw.layout);
  if ('ok' in layout && layout.ok === false) {
    return layout;
  }

  const doc: JsonSlideDefaultDocument = {
    theme: raw.theme as SlideTheme | undefined,
    frame,
    backdrop,
    content,
    header,
    layout: layout as JsonSlideLayout,
  };

  return { ok: true, doc };
}
