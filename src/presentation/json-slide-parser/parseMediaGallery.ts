import type {
  JsonSlideMediaGalleryItem,
  JsonSlideMediaGalleryItemImage,
  JsonSlideMediaGalleryItemVideo,
  JsonSlideMediaGalleryCellVariant,
  JsonSlideMediaGalleryObjectAlign,
  JsonSlideMediaGalleryObjectFit,
  JsonSlideMediaGalleryPreset,
  JsonSlideMediaRowJustify,
} from '../jsonSlideTypes';
import { err, isRecord, parseOptionalString, parseString } from './parseUtils';

const MEDIA_GALLERY_PRESETS = new Set<JsonSlideMediaGalleryPreset>(['single', 'pair', 'row', 'column', 'auto']);
const MEDIA_GALLERY_CELL_VARIANTS = new Set<JsonSlideMediaGalleryCellVariant>(['panel', 'fill']);
const MEDIA_ROW_JUSTIFIES = new Set<JsonSlideMediaRowJustify>(['start', 'end']);
const MEDIA_GALLERY_OBJECT_ALIGNS = new Set<JsonSlideMediaGalleryObjectAlign>(['left', 'center', 'right']);
const MEDIA_GALLERY_OBJECT_FITS = new Set<JsonSlideMediaGalleryObjectFit>(['contain', 'cover']);

export { MEDIA_GALLERY_PRESETS, MEDIA_GALLERY_CELL_VARIANTS, MEDIA_ROW_JUSTIFIES };

export function parseMediaGalleryItems(
  raw: unknown,
  path: string,
): JsonSlideMediaGalleryItem[] | { ok: false; error: string } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return err(`${path} must be a non-empty array`);
  }
  const items: JsonSlideMediaGalleryItem[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const el = raw[i];
    if (!isRecord(el)) {
      return err(`${path}[${i}] must be an object`);
    }
    const type = el.type;
    if (type !== 'image' && type !== 'video') {
      return err(`${path}[${i}].type must be "image" or "video"`);
    }
    const srcResult = parseString(el.src, `${path}[${i}].src`);
    if (typeof srcResult === 'object' && 'ok' in srcResult && srcResult.ok === false) {
      return srcResult;
    }
    const src = srcResult as string;
    if (src.trim().length === 0) {
      return err(`${path}[${i}].src must be non-empty`);
    }
    const captionResult = parseOptionalString(el.caption, `${path}[${i}].caption`);
    if (
      typeof captionResult === 'object' &&
      captionResult !== null &&
      'ok' in captionResult &&
      captionResult.ok === false
    ) {
      return captionResult;
    }
    const caption = captionResult as string | undefined;
    let showCaption: boolean | undefined;
    if (el.showCaption !== undefined) {
      if (typeof el.showCaption !== 'boolean') {
        return err(`${path}[${i}].showCaption must be a boolean when present`);
      }
      showCaption = el.showCaption;
    }
    if (type === 'image') {
      const altResult = parseOptionalString(el.alt, `${path}[${i}].alt`);
      if (
        typeof altResult === 'object' &&
        altResult !== null &&
        'ok' in altResult &&
        altResult.ok === false
      ) {
        return altResult;
      }
      const alt = altResult as string | undefined;
      let objectAlign: JsonSlideMediaGalleryObjectAlign | undefined;
      if (el.objectAlign !== undefined) {
        if (
          typeof el.objectAlign !== 'string' ||
          !MEDIA_GALLERY_OBJECT_ALIGNS.has(el.objectAlign as JsonSlideMediaGalleryObjectAlign)
        ) {
          return err(`${path}[${i}].objectAlign must be left, center, or right`);
        }
        objectAlign = el.objectAlign as JsonSlideMediaGalleryObjectAlign;
      }
      let objectFit: JsonSlideMediaGalleryObjectFit | undefined;
      if (el.objectFit !== undefined) {
        if (
          typeof el.objectFit !== 'string' ||
          !MEDIA_GALLERY_OBJECT_FITS.has(el.objectFit as JsonSlideMediaGalleryObjectFit)
        ) {
          return err(`${path}[${i}].objectFit must be contain or cover`);
        }
        objectFit = el.objectFit as JsonSlideMediaGalleryObjectFit;
      }
      const item: JsonSlideMediaGalleryItemImage = {
        type: 'image',
        src,
        ...(alt !== undefined ? { alt } : {}),
        ...(caption !== undefined ? { caption } : {}),
        ...(showCaption !== undefined ? { showCaption } : {}),
        ...(objectAlign !== undefined ? { objectAlign } : {}),
        ...(objectFit !== undefined ? { objectFit } : {}),
      };
      items.push(item);
    } else {
      let objectFit: JsonSlideMediaGalleryObjectFit | undefined;
      if (el.objectFit !== undefined) {
        if (
          typeof el.objectFit !== 'string' ||
          !MEDIA_GALLERY_OBJECT_FITS.has(el.objectFit as JsonSlideMediaGalleryObjectFit)
        ) {
          return err(`${path}[${i}].objectFit must be contain or cover`);
        }
        objectFit = el.objectFit as JsonSlideMediaGalleryObjectFit;
      }
      let autoplay: boolean | undefined;
      if (el.autoplay !== undefined) {
        if (typeof el.autoplay !== 'boolean') return err(`${path}[${i}].autoplay must be a boolean when present`);
        autoplay = el.autoplay;
      }
      let loop: boolean | undefined;
      if (el.loop !== undefined) {
        if (typeof el.loop !== 'boolean') return err(`${path}[${i}].loop must be a boolean when present`);
        loop = el.loop;
      }
      let muted: boolean | undefined;
      if (el.muted !== undefined) {
        if (typeof el.muted !== 'boolean') return err(`${path}[${i}].muted must be a boolean when present`);
        muted = el.muted;
      }
      let playsInline: boolean | undefined;
      if (el.playsInline !== undefined) {
        if (typeof el.playsInline !== 'boolean')
          return err(`${path}[${i}].playsInline must be a boolean when present`);
        playsInline = el.playsInline;
      }
      const item: JsonSlideMediaGalleryItemVideo = {
        type: 'video',
        src,
        ...(caption !== undefined ? { caption } : {}),
        ...(showCaption !== undefined ? { showCaption } : {}),
        ...(autoplay !== undefined ? { autoplay } : {}),
        ...(loop !== undefined ? { loop } : {}),
        ...(muted !== undefined ? { muted } : {}),
        ...(playsInline !== undefined ? { playsInline } : {}),
        ...(objectFit !== undefined ? { objectFit } : {}),
      };
      items.push(item);
    }
  }
  return items;
}
