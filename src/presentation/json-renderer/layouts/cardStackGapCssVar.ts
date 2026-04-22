import type { JsonSlideGridGap } from '../../jsonSlideTypes';

/** Maps card / component `gap` and `stackGap` tokens to stack spacing CSS variables (see `index.css`). */
export function cardStackGapCssVar(gap: JsonSlideGridGap): string {
  if (gap === 'xs') {
    return 'var(--slide-stack-gap-xs)';
  }
  if (gap === 'sm') {
    return 'var(--slide-stack-gap-sm)';
  }
  if (gap === 'lg') {
    return 'var(--slide-stack-gap-lg)';
  }
  return 'var(--slide-stack-gap-md)';
}
