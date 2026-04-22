import { isJsonSlideImageCoverDocument, isJsonSlideTextStackDocument } from '../jsonSlideTypes';
import { isJsonSlideDefinition, type SlideRenderProps } from '../types';
import { JsonRendererMissingDocument } from './JsonRendererErrorState';
import { JsonImageCoverShell } from './JsonImageCoverShell';
import { JsonTextStackShell } from './JsonTextStackShell';
import { JsonSlideShell } from './JsonSlideShell';
import { renderJsonLayout } from './layouts/renderJsonLayout';

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
      {renderJsonLayout(doc.layout)}
    </JsonSlideShell>
  );
}
