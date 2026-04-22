import type { JsonSlideCardItemText, JsonSlideUniformGridLayout } from '../../jsonSlideTypes';
import { isJsonSlideCardItemText } from '../../jsonSlideTypes';
import { JsonCardNode } from '../nodes/JsonCardNode';
import { bentoGridGapCssVar } from './bentoGridGapVar';

export interface JsonUniformGridLayoutProps {
  layout: JsonSlideUniformGridLayout;
}

export function JsonUniformGridLayoutView({ layout }: JsonUniformGridLayoutProps) {
  const gapVar = bentoGridGapCssVar(layout.gap);

  return (
    <div
      className="grid h-full min-h-0 w-full flex-1 items-stretch auto-rows-fr"
      style={{
        gap: gapVar,
        gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
        gridAutoRows: 'minmax(0, 1fr)',
      }}
    >
      {layout.items.map((card, i) => {
        const allItems = card.items ?? card.slots?.flatMap((s) => s.items) ?? [];
        const firstText = allItems.find((it): it is JsonSlideCardItemText => isJsonSlideCardItemText(it));
        const keySeed = firstText?.text.slice(0, 12) ?? `card-${i}`;
        return (
        <div key={`uniform-${i}-${keySeed}`} className="flex min-h-0 h-full min-w-0 flex-col">
          <JsonCardNode card={card} delay={0.2 + i * 0.07} />
        </div>
        );
      })}
    </div>
  );
}
