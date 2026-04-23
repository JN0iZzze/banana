import type { JsonSlideRegion } from '../../jsonSlideTypes';
import { JsonCardNode } from './JsonCardNode';
import { JsonQuoteNode } from './JsonQuoteNode';
import { JsonTextRegionNode } from './JsonTextRegionNode';
import { renderJsonLayout } from '../layouts/renderJsonLayout';

export interface JsonSlideRegionNodeProps {
  region: JsonSlideRegion;
  delay: number;
}

/** Renders a layout region: card, quote, text, or nested layout. */
export function JsonSlideRegionNode({ region, delay }: JsonSlideRegionNodeProps) {
  if (region.kind === 'card') {
    return <JsonCardNode card={region.card} delay={delay} />;
  }
  if (region.kind === 'quote') {
    return <JsonQuoteNode quote={region.quote} delay={delay} />;
  }
  if (region.kind === 'text') {
    return <JsonTextRegionNode text={region.text} delay={delay} />;
  }
  return <div className="flex h-full min-h-0 flex-col">{renderJsonLayout(region.layout)}</div>;
}
