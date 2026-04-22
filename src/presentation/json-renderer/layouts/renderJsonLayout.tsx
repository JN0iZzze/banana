import type { ReactNode } from 'react';
import type { JsonSlideLayout } from '../../jsonSlideTypes';
import { JsonLayoutDecorationsOverlay } from '../JsonLayoutDecorationsOverlay';
import { renderJsonLayoutInner } from './renderJsonLayoutInner';

export function renderJsonLayout(layout: JsonSlideLayout): ReactNode {
  const inner = renderJsonLayoutInner(layout);
  const decorations = layout.decorations;
  if (!decorations?.length) {
    return inner;
  }
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col">
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">{inner}</div>
      <JsonLayoutDecorationsOverlay decorations={decorations} />
    </div>
  );
}
