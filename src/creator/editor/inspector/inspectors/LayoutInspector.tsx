/**
 * Инспектор лэйаута (`JsonSlideLayout`).
 *
 * Path указывает на сам объект layout (`layout` для верхнеуровневого, либо
 * `<...>.region.layout` для вложенного). Поля строго по типу:
 *   - `type` — read-only (смена типа ломает всю внутреннюю структуру);
 *   - `gap` — общий для всех вариантов (`xs | sm | md | lg`).
 * Для отдельных вариантов добавлены безопасные численные правки:
 *   - `uniformGrid` — `columns`;
 *   - `bentoGrid`   — `columns`, `rows`;
 *   - `splitLayout` — `leftSpan`, `rightSpan`.
 *
 * Эти поля раньше частично жили в template default-form. Здесь они пишутся
 * прямо в путь `layout.<…>` через `patchNode` без template-веток.
 */

import type { JsonSlideLayout } from '../../../../presentation/jsonSlideTypes';
import { Input } from '../../../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import {
  Field,
  Section,
  fromUiSelectValue,
  toUiSelectValue,
} from '../inspectorPrimitives';
import { getNodeByPath } from '../pathOps';
import type { NodeInspectorProps } from '../registry';

const GAP_OPTIONS = [
  { value: '', label: '— по умолчанию —' },
  { value: 'xs', label: 'xs' },
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
] as const;

export function LayoutInspector({ selection, doc, patchNode }: NodeInspectorProps) {
  const layout = getNodeByPath(doc, selection.path) as JsonSlideLayout | undefined;

  if (!layout) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-3 text-xs text-neutral-500">
        Лэйаут не найден по пути{' '}
        <span className="font-mono text-neutral-300">{selection.path}</span>.
      </div>
    );
  }

  const setGap = (value: '' | NonNullable<JsonSlideLayout['gap']>) => {
    patchNode(selection.path, (node) => {
      const base = { ...(node as JsonSlideLayout) } as JsonSlideLayout & {
        gap?: NonNullable<JsonSlideLayout['gap']>;
      };
      if (value === '') {
        delete base.gap;
        return base;
      }
      base.gap = value;
      return base;
    });
  };

  const setNumberField = (key: 'columns' | 'rows' | 'leftSpan' | 'rightSpan', raw: string) => {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    patchNode(selection.path, (node) => ({
      ...(node as Record<string, unknown>),
      [key]: parsed,
    }));
  };

  return (
    <>
      <Section title="Лэйаут">
        <Field label="Тип">
          <div className="text-xs text-neutral-300">
            <span className="rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 font-mono text-[11px]">
              {layout.type}
            </span>
          </div>
        </Field>
        <Field label="Gap">
          <Select
            value={toUiSelectValue(layout.gap ?? '')}
            onValueChange={(raw) => {
              const v = fromUiSelectValue(raw);
              setGap(v === '' ? '' : (v as NonNullable<JsonSlideLayout['gap']>));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GAP_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={toUiSelectValue(o.value)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Section>

      {layout.type === 'uniformGrid' ? (
        <Section title="uniformGrid">
          <Field label="Columns">
            <Input
              type="number"
              min={1}
              value={layout.columns}
              onChange={(e) => setNumberField('columns', e.target.value)}
              size="sm"
              className="w-full"
            />
          </Field>
        </Section>
      ) : null}

      {layout.type === 'bentoGrid' ? (
        <Section title="bentoGrid">
          <Field label="Columns">
            <Input
              type="number"
              min={1}
              value={layout.columns}
              onChange={(e) => setNumberField('columns', e.target.value)}
              size="sm"
              className="w-full"
            />
          </Field>
          <Field label="Rows">
            <Input
              type="number"
              min={1}
              value={layout.rows}
              onChange={(e) => setNumberField('rows', e.target.value)}
              size="sm"
              className="w-full"
            />
          </Field>
        </Section>
      ) : null}

      {layout.type === 'splitLayout' ? (
        <Section title="splitLayout">
          <Field label="Left span">
            <Input
              type="number"
              min={1}
              value={layout.leftSpan}
              onChange={(e) => setNumberField('leftSpan', e.target.value)}
              size="sm"
              className="w-full"
            />
          </Field>
          <Field label="Right span">
            <Input
              type="number"
              min={1}
              value={layout.rightSpan}
              onChange={(e) => setNumberField('rightSpan', e.target.value)}
              size="sm"
              className="w-full"
            />
          </Field>
          <p className="text-[11px] leading-4 text-neutral-500">
            Сумма spans влияет на пропорции колонок.
          </p>
        </Section>
      ) : null}
    </>
  );
}
