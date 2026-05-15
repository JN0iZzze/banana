import type { JsonSlideLayout } from '../jsonSlideTypes';
import { isJsonSlideImageCoverDocument, isJsonSlideTextStackDocument } from '../jsonSlideTypes';
import { isJsonSlideDefinition, type SlideRenderProps } from '../types';
import { useInspectorSelectable } from '../../creator/inline-edit';
import { cn } from '../../ui/slides/cn';
import { JsonRendererMissingDocument } from './JsonRendererErrorState';
import { JsonImageCoverShell } from './JsonImageCoverShell';
import { JsonTextStackShell } from './JsonTextStackShell';
import { JsonSlideShell } from './JsonSlideShell';
import { renderJsonLayout } from './layouts/renderJsonLayout';

/**
 * Корневой layout `default`-документа как самостоятельная selectable-сущность.
 *
 * Канонический path корневого layout — `layout` (тот же, что уходит в
 * `renderJsonLayout` как `basePath`). Hook нельзя звать прямо в
 * `JsonSlideRenderer` из-за ранних return'ов под другие шаблоны, поэтому
 * выделен отдельный компонент. Селект-обёртка повторяет контракт вложенного
 * layout из `JsonSlideRegionNode`: `stopPropagation` в `useInspectorSelectable`
 * у дочерних card/quote/text срабатывает раньше, поэтому клики по контенту
 * сюда не доходят — выделяется только пустая geometry-зона layout-а.
 */
function JsonRootLayout({ layout }: { layout: JsonSlideLayout }) {
  const selectable = useInspectorSelectable('layout', 'layout');
  return (
    <div
      {...selectable}
      className={cn('flex min-h-0 w-full flex-1 flex-col', selectable.className)}
    >
      {renderJsonLayout(layout, 'layout')}
    </div>
  );
}

export function JsonSlideRenderer({ slide, index, totalSlides }: SlideRenderProps) {
  if (!isJsonSlideDefinition(slide)) {
    return (
      <JsonRendererMissingDocument
        key={`json-slide-missing-${slide.id}-${index}`}
        slideId={slide.id}
      />
    );
  }

  const { jsonDocument: doc } = slide;

  if (isJsonSlideImageCoverDocument(doc)) {
    return (
      <JsonImageCoverShell
        key={`json-slide-image-cover-${slide.id}-${index}`}
        cover={doc.cover}
      />
    );
  }

  if (isJsonSlideTextStackDocument(doc)) {
    return (
      <JsonTextStackShell
        key={`json-slide-text-stack-${slide.id}-${index}`}
        doc={doc}
      />
    );
  }

  return (
    <JsonSlideShell
      key={`json-slide-${slide.id}-${index}`}
      doc={doc}
      index={index}
      totalSlides={totalSlides}
    >
      <JsonRootLayout layout={doc.layout} />
    </JsonSlideShell>
  );
}
