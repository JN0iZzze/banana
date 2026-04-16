import type { ComponentType } from 'react';

export type SlideTheme = 'editorial' | 'signal' | 'cinema';

export type RevealPreset = 'hero' | 'soft' | 'enter-up' | 'enter-left' | 'enter-right' | 'none';

export type SlideTransition = RevealPreset;

export interface SlideRenderProps {
  slide: SlideDefinition;
  index: number;
  totalSlides: number;
}

export interface SlideDefinition {
  id: string;
  title: string;
  theme: SlideTheme;
  component: ComponentType<SlideRenderProps>;
  /** Не показывать в навигации и списке (шаблоны, черновики). */
  hidden?: boolean;
  notes?: string;
  preloadAssets?: string[];
}

export interface DeckDefinition {
  id: string;
  title: string;
  slides: SlideDefinition[];
  defaultSlideId?: string;
}

