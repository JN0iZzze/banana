import type { ComponentType } from 'react';
import type { JsonSlideDocument } from './jsonSlideTypes';

export type SlideTheme = 'editorial' | 'signal' | 'cinema';

export type RevealPreset =
  | 'hero'
  | 'soft'
  | 'scale-in'
  | 'enter-up'
  | 'enter-left'
  | 'enter-right'
  | 'none';

export type SlideTransition = RevealPreset;

export type SlideExternalLink = {
  href: string;
  label: string;
};

export interface BaseSlideDefinition {
  id: string;
  title: string;
  theme: SlideTheme;
  /** Не показывать в навигации и списке (шаблоны, черновики). */
  hidden?: boolean;
  notes?: string;
  preloadAssets?: string[];
  /** Внешняя ссылка (например шаблон Floux); рендерится компонентом слайда, если поддерживается. */
  link?: string;
  /** Подпись к ссылке; если не задана при наличии `link`, показывается сам URL. */
  linkLabel?: string;
  /** Несколько ссылок под заголовком (legacy; для JSON-слайдов ссылки в документе textStack). */
  links?: SlideExternalLink[];
}

export interface LegacySlideDefinition extends BaseSlideDefinition {
  component: ComponentType<SlideRenderProps>;
}

export interface JsonSlideDefinition extends BaseSlideDefinition {
  component: ComponentType<SlideRenderProps>;
  jsonDocument: JsonSlideDocument;
}

export type SlideDefinition = LegacySlideDefinition | JsonSlideDefinition;

export function isJsonSlideDefinition(slide: SlideDefinition): slide is JsonSlideDefinition {
  return 'jsonDocument' in slide && slide.jsonDocument !== undefined;
}

export interface SlideRenderProps {
  slide: SlideDefinition;
  index: number;
  totalSlides: number;
}

export interface DeckDefinition {
  id: string;
  title: string;
  slides: SlideDefinition[];
  defaultSlideId?: string;
}
