import type { JsonSlideBentoLayout } from '../../jsonSlideTypes';
import { JsonSlideRegionNode } from '../nodes/JsonSlideRegionNode';
import { bentoGridGapCssVar } from './bentoGridGapVar';

export interface JsonBentoLayoutProps {
  layout: JsonSlideBentoLayout;
  /**
   * Путь до самого layout-узла (например, `layout.bentoGrid`).
   * Каждому элементу передаётся `${basePath}.items.${i}.region`,
   * см. `collectEditablePaths.walkBento`.
   */
  basePath?: string;
}

export function JsonBentoLayoutView({ layout, basePath }: JsonBentoLayoutProps) {
  const gapVar = bentoGridGapCssVar(layout.gap);

  return (
    <div
      className="grid min-h-0 w-full flex-1"
      style={{
        gap: gapVar,
        gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
      }}
    >
      {layout.items.map((item, i) => (
        <div
          key={`bento-${i}-${item.colStart}-${item.rowStart}`}
          className="min-h-0"
          style={{
            gridColumn: `${item.colStart} / span ${item.colSpan}`,
            gridRow: `${item.rowStart} / span ${item.rowSpan}`,
          }}
        >
          <JsonSlideRegionNode
            region={item.region}
            delay={0.2 + i * 0.06}
            editorPath={basePath != null ? `${basePath}.items.${i}.region` : undefined}
          />
        </div>
      ))}
    </div>
  );
}
