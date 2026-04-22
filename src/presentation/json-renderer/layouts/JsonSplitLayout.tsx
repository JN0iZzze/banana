import type { JsonSlideSplitLayout } from '../../jsonSlideTypes';
import { SlideColumn, SlideGrid } from '../../../ui/slides';
import { JsonSlideRegionNode } from '../nodes/JsonSlideRegionNode';

export interface JsonSplitLayoutViewProps {
  layout: JsonSlideSplitLayout;
}

export function JsonSplitLayoutView({ layout }: JsonSplitLayoutViewProps) {
  return (
    <SlideGrid columns={12} gap={layout.gap ?? 'md'} className="min-h-0 flex-1 auto-rows-fr items-stretch">
      <SlideColumn
        span={layout.leftSpan as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}
        className="min-h-0"
      >
        <JsonSlideRegionNode region={layout.left} delay={0.16} />
      </SlideColumn>
      <SlideColumn
        span={layout.rightSpan as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}
        className="min-h-0"
      >
        <JsonSlideRegionNode region={layout.right} delay={0.22} />
      </SlideColumn>
    </SlideGrid>
  );
}
