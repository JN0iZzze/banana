/**
 * Инспектор заголовка слайда (`header` в `JsonSlideDefaultDocument`).
 *
 * Path всегда `header` — selection приходит ровно для этого узла. Поля строго
 * по типу `JsonSlideHeader` из `presentation/jsonSlideTypes.ts`:
 *   - `meta`  (обязательный) — короткая надпись над заголовком;
 *   - `align` — `left | center`.
 *
 * `title` и `lead` редактируются inline на сцене (двойной клик), здесь их
 * намеренно не дублируем, чтобы не плодить два места правки одного и того же.
 */

import { AlignCenter, AlignLeft } from 'lucide-react';
import type { JsonSlideHeader } from '../../../../presentation/jsonSlideTypes';
import { Input } from '../../../ui/input';
import { Field, IconToggleRow, Section } from '../inspectorPrimitives';
import type { NodeInspectorProps } from '../registry';
import { getNodeByPath } from '../pathOps';

const HEADER_ALIGN_OPTIONS = [
  { value: 'left' as const, icon: AlignLeft, label: 'слева' },
  { value: 'center' as const, icon: AlignCenter, label: 'по центру' },
];

export function HeaderInspector({ selection, doc, actions }: NodeInspectorProps) {
  if (actions.kind !== 'header') return null;

  const header = getNodeByPath(doc, selection.path) as JsonSlideHeader | undefined;

  if (!header) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-3 text-xs text-neutral-500">
        Узел заголовка не найден по пути{' '}
        <span className="font-mono text-neutral-300">{selection.path}</span>.
      </div>
    );
  }

  const align: NonNullable<JsonSlideHeader['align']> = header.align ?? 'left';

  return (
    <Section title="Заголовок">
      <Field label="Meta (обязательно)">
        <Input
          type="text"
          value={header.meta}
          onChange={(e) => {
            const next = e.target.value;
            actions.header.updateMeta(next);
          }}
          size="sm"
          className="w-full"
        />
      </Field>
      <Field label="Выравнивание">
        <IconToggleRow
          value={align}
          options={HEADER_ALIGN_OPTIONS}
          onChange={(value) => actions.header.updateAlign(value)}
        />
      </Field>
    </Section>
  );
}
