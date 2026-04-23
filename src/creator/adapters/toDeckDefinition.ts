import { JsonSlideRenderer } from '../../presentation/json-renderer/JsonSlideRenderer';
import type { DeckDefinition, JsonSlideDefinition, SlideTheme } from '../../presentation/types';
import { isValidSlide } from '../domain/types';
import type { CreatorDeck, CreatorSlide } from '../domain/types';

export interface ToDeckDefinitionOptions {
  /** Theme applied to slides (both at deck level and per-slide fallback). */
  defaultTheme?: SlideTheme;
  /** Include slides marked hidden. Defaults to `false`. */
  includeHidden?: boolean;
}

const DEFAULT_THEME: SlideTheme = 'editorial';

export function toJsonSlideDefinition(
  slide: CreatorSlide,
  defaultTheme: SlideTheme,
): JsonSlideDefinition | null {
  if (!isValidSlide(slide.validation)) {
    return null;
  }
  const doc = slide.validation.doc;
  const theme = doc.theme ?? defaultTheme;
  return {
    id: slide.id,
    title: slide.title ?? 'Без названия',
    theme,
    component: JsonSlideRenderer,
    jsonDocument: doc,
    hidden: slide.hidden,
    notes: slide.speakerNotes ?? undefined,
  };
}

export function toDeckDefinition(
  deck: CreatorDeck,
  opts: ToDeckDefinitionOptions = {},
): DeckDefinition {
  const defaultTheme = opts.defaultTheme ?? DEFAULT_THEME;
  const includeHidden = opts.includeHidden ?? false;

  const slides: JsonSlideDefinition[] = [];
  for (const slide of [...deck.slides].sort((a, b) => a.orderIndex - b.orderIndex)) {
    if (!includeHidden && slide.hidden) continue;
    const def = toJsonSlideDefinition(slide, defaultTheme);
    if (def !== null) slides.push(def);
  }

  return {
    id: deck.slug,
    title: deck.title,
    slides,
  };
}
