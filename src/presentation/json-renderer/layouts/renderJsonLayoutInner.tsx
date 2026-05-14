import type { ReactNode } from 'react';
import type { JsonSlideLayout } from '../../jsonSlideTypes';
import { JsonBentoLayoutView } from './JsonBentoLayout';
import { JsonColumnLayout } from './JsonColumnLayouts';
import { JsonMediaGalleryLayoutView } from './JsonMediaGalleryLayout';
import { JsonSplitLayoutView } from './JsonSplitLayout';
import { JsonStackLayoutView } from './JsonStackLayout';
import { JsonUniformGridLayoutView } from './JsonUniformGridLayout';

/** Layout tree only (no decoration wrapper). */
export function renderJsonLayoutInner(layout: JsonSlideLayout, basePath?: string): ReactNode {
  if (layout.type === 'asymmetricColumns' || layout.type === 'equalColumns') {
    return (
      <JsonColumnLayout
        items={layout.items}
        gap={layout.gap}
        basePath={basePath}
      />
    );
  }
  if (layout.type === 'uniformGrid') {
    return (
      <JsonUniformGridLayoutView
        layout={layout}
        basePath={basePath}
      />
    );
  }
  if (layout.type === 'splitLayout') {
    return (
      <JsonSplitLayoutView
        layout={layout}
        basePath={basePath}
      />
    );
  }
  if (layout.type === 'stackLayout') {
    return (
      <JsonStackLayoutView
        layout={layout}
        basePath={basePath}
      />
    );
  }
  if (layout.type === 'mediaGallery') {
    // TODO(inline-edit): пробросить basePath в JsonMediaGalleryLayoutView (этап E2.2d).
    return <JsonMediaGalleryLayoutView layout={layout} />;
  }
  return (
    <JsonBentoLayoutView
      layout={layout}
      basePath={basePath}
    />
  );
}
