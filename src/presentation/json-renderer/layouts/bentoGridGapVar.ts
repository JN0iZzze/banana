import type { JsonSlideGridGap } from '../../jsonSlideTypes';

export function bentoGridGapCssVar(gap: JsonSlideGridGap | undefined): string {
  const token = gap ?? 'md';
  if (token === 'xs') {
    return 'var(--slide-grid-gap-xs)';
  }
  if (token === 'sm') {
    return 'var(--slide-grid-gap-sm)';
  }
  if (token === 'lg') {
    return 'var(--slide-grid-gap-lg)';
  }
  return 'var(--slide-grid-gap-md)';
}
