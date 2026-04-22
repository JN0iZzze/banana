import type { JsonSlideStackLayout } from '../../jsonSlideTypes';
import { JsonSlideRegionNode } from '../nodes/JsonSlideRegionNode';
import { bentoGridGapCssVar } from './bentoGridGapVar';

export interface JsonStackLayoutViewProps {
  layout: JsonSlideStackLayout;
}

export function JsonStackLayoutView({ layout }: JsonStackLayoutViewProps) {
  const gapValue = bentoGridGapCssVar(layout.gap);
  const rowTemplate = layout.items.map((it) => `minmax(0, ${it.span}fr)`).join(' ');

  return (
    <div
      className="grid h-full min-h-0 min-w-0 w-full flex-1"
      style={{ gap: gapValue, gridTemplateRows: rowTemplate }}
    >
      {layout.items.map((item, i) => (
        <div key={`stack-${i}-${item.span}`} className="min-h-0 min-w-0">
          <JsonSlideRegionNode region={item.region} delay={0.16 + i * 0.06} />
        </div>
      ))}
    </div>
  );
}
