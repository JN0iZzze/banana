import { isJsonSlideImageCoverDocument } from '../jsonSlideTypes';
import type { SlideRenderProps } from '../types';
import { getJsonSlideDocumentForSlideId } from '../jsonSlideDocumentRegistry';
import { JsonRendererMissingDocument } from './JsonRendererErrorState';
import { JsonImageCoverShell } from './JsonImageCoverShell';
import { JsonSlideShell } from './JsonSlideShell';
import { renderJsonLayout } from './layouts/renderJsonLayout';

export function JsonSlideRenderer({ slide, index, totalSlides }: SlideRenderProps) {
  const doc = getJsonSlideDocumentForSlideId(slide.id);
  if (!doc) {
    return (
      <JsonRendererMissingDocument
        key={`json-slide-missing-${slide.id}-${index}`}
        slideId={slide.id}
      />
    );
  }

  if (isJsonSlideImageCoverDocument(doc)) {
    return (
      <JsonImageCoverShell
        key={`json-slide-image-cover-${slide.id}-${index}`}
        cover={doc.cover}
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
