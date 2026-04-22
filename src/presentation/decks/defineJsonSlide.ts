import { parseJsonSlideDocument } from '../parseJsonSlideDocument';
import type { JsonSlideDocument } from '../jsonSlideTypes';
import { JsonSlideRenderer } from '../json-renderer/JsonSlideRenderer';
import type { JsonSlideDefinition, SlideTheme, SlideExternalLink } from '../types';

export function defineJsonSlide(input: {
  id: string;
  title: string;
  theme: SlideTheme;
  /** Raw imported JSON; validated at build time. */
  raw: unknown;
  /** Filename or label for error messages, e.g. `slide-foo.json`. */
  source: string;
  hidden?: boolean;
  notes?: string;
  preloadAssets?: string[];
  link?: string;
  linkLabel?: string;
  links?: SlideExternalLink[];
}): JsonSlideDefinition {
  const parsed = parseJsonSlideDocument(input.raw);
  if (!parsed.ok) {
    throw new Error(`Invalid JSON slide schema (${input.source}): ${parsed.error}`);
  }
  const doc: JsonSlideDocument = parsed.doc;
  return {
    id: input.id,
    title: input.title,
    theme: input.theme,
    component: JsonSlideRenderer,
    jsonDocument: doc,
    hidden: input.hidden,
    notes: input.notes,
    preloadAssets: input.preloadAssets,
    link: input.link,
    linkLabel: input.linkLabel,
    links: input.links,
  };
}
