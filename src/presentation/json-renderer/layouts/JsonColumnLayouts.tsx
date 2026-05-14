import type { JsonSlideColumnItem, JsonSlideGridGap } from '../../jsonSlideTypes';
import { SlideColumn, SlideGrid } from '../../../ui/slides';
import { JsonSlideRegionNode } from '../nodes/JsonSlideRegionNode';

export interface JsonColumnLayoutProps {
  items: JsonSlideColumnItem[];
  gap?: JsonSlideGridGap;
  /**
   * Путь до самого layout-узла (например, `layout.equalColumns`).
   * Каждому элементу столбца передаётся `${basePath}.items.${i}.region`,
   * что соответствует форме путей из `collectEditablePaths.walkColumnItems`.
   */
  basePath?: string;
}

export function JsonColumnLayout({ items, gap, basePath }: JsonColumnLayoutProps) {
  return (
    <SlideGrid columns={12} gap={gap ?? 'md'} className="min-h-0 flex-1 auto-rows-fr items-stretch">
      {items.map((item, i) => (
        <SlideColumn key={`col-${i}-${item.span}`} span={item.span as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}>
          <JsonSlideRegionNode
            region={item.region}
            delay={0.2 + i * 0.08}
            editorPath={basePath != null ? `${basePath}.items.${i}.region` : undefined}
          />
        </SlideColumn>
      ))}
    </SlideGrid>
  );
}
