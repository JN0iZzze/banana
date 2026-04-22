import type { ReactNode } from 'react';
import type { JsonSlideLayout } from '../../jsonSlideTypes';
import { JsonBentoLayoutView } from './JsonBentoLayout';
import { JsonColumnLayout } from './JsonColumnLayouts';
import { JsonMediaGalleryLayoutView } from './JsonMediaGalleryLayout';
import { JsonSplitLayoutView } from './JsonSplitLayout';
import { JsonStackLayoutView } from './JsonStackLayout';
import { JsonUniformGridLayoutView } from './JsonUniformGridLayout';

export function renderJsonLayout(layout: JsonSlideLayout): ReactNode {
  if (layout.type === 'asymmetricColumns' || layout.type === 'equalColumns') {
    return <JsonColumnLayout items={layout.items} gap={layout.gap} />;
  }
  if (layout.type === 'uniformGrid') {
    return <JsonUniformGridLayoutView layout={layout} />;
  }
  if (layout.type === 'splitLayout') {
    return <JsonSplitLayoutView layout={layout} />;
  }
  if (layout.type === 'stackLayout') {
    return <JsonStackLayoutView layout={layout} />;
  }
  if (layout.type === 'mediaGallery') {
    return <JsonMediaGalleryLayoutView layout={layout} />;
  }
  return <JsonBentoLayoutView layout={layout} />;
}
