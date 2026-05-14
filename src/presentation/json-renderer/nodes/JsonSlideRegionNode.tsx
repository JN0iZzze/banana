import type { JsonSlideRegion } from '../../jsonSlideTypes';
import { JsonCardNode } from './JsonCardNode';
import { JsonQuoteNode } from './JsonQuoteNode';
import { JsonTextRegionNode } from './JsonTextRegionNode';
import { renderJsonLayout } from '../layouts/renderJsonLayout';
import { useInspectorSelectable } from '../../../creator/inline-edit';

export interface JsonSlideRegionNodeProps {
  region: JsonSlideRegion;
  delay: number;
  /**
   * Absolute path from the document root to this region (e.g.
   * `layout.equalColumns.items.0.region`). Forwarded down to text-bearing
   * region nodes so they can register editable items with the inline-edit
   * registry. Optional — without it the renderer behaves as in presentation
   * mode.
   */
  editorPath?: string;
}

/** Renders a layout region: card, quote, text, or nested layout. */
export function JsonSlideRegionNode({ region, delay, editorPath }: JsonSlideRegionNodeProps) {
  // Path для вложенного layout (kind: 'layout'); вычисляем безусловно ради
  // стабильного порядка хуков, а используем только в layout-ветке.
  const layoutPath = editorPath != null ? `${editorPath}.layout` : undefined;
  const layoutSelectable = useInspectorSelectable(layoutPath, 'layout');

  if (region.kind === 'card') {
    return (
      <JsonCardNode
        card={region.card}
        delay={delay}
        editorPath={editorPath != null ? `${editorPath}.card` : undefined}
      />
    );
  }
  if (region.kind === 'quote') {
    return (
      <JsonQuoteNode
        quote={region.quote}
        delay={delay}
        editorPath={editorPath != null ? `${editorPath}.quote` : undefined}
      />
    );
  }
  if (region.kind === 'text') {
    return (
      <JsonTextRegionNode
        text={region.text}
        delay={delay}
        editorPath={editorPath != null ? `${editorPath}.text` : undefined}
      />
    );
  }
  return (
    <div className="flex h-full min-h-0 flex-col" {...layoutSelectable}>
      {renderJsonLayout(region.layout, layoutPath)}
    </div>
  );
}
