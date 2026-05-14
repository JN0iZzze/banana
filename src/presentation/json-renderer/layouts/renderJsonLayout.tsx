import type { ReactNode } from 'react';
import type { JsonSlideLayout } from '../../jsonSlideTypes';
import { JsonLayoutDecorationsOverlay } from '../JsonLayoutDecorationsOverlay';
import { renderJsonLayoutInner } from './renderJsonLayoutInner';

/**
 * `basePath` — абсолютный путь от корня документа до этого layout-узла
 * (например, `layout` для корневого или `layout.splitLayout.left.layout`
 * для вложенного). Пробрасывается дальше в лэйауты, чтобы text-region
 * ноды смогли регистрироваться в inline-edit registry. Если не передан —
 * рендерер ведёт себя как в презентационном режиме.
 */
export function renderJsonLayout(layout: JsonSlideLayout, basePath?: string): ReactNode {
  const inner = renderJsonLayoutInner(layout, basePath);
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
