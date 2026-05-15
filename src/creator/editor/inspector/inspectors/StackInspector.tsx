/**
 * Инспектор корневого `stack` в `JsonSlideTextStackDocument`.
 *
 * Поля строго по типу `JsonSlideTextStack`:
 *   - `align`   — `left | center | right`;
 *   - `justify` — `start | center | end`;
 *   - `gap`     — `xs | sm | md | lg` (опц.).
 *
 * `items` — read-only summary; добавление/перестановку правим через Raw JSON.
 * Тексты внутри items редактируются inline на сцене.
 */

import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignStartVertical,
} from 'lucide-react';
import type {
  JsonSlideTextStack,
  JsonSlideTextStackAlign,
  JsonSlideTextStackItem,
  JsonSlideTextStackJustify,
} from '../../../../presentation/jsonSlideTypes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import {
  Field,
  IconToggleRow,
  Section,
  fromUiSelectValue,
  toUiSelectValue,
} from '../inspectorPrimitives';
import { getNodeByPath } from '../pathOps';
import type { NodeInspectorProps } from '../registry';

const ALIGN_OPTIONS = [
  { value: 'left' as const, icon: AlignStartVertical, label: 'слева' },
  { value: 'center' as const, icon: AlignCenterVertical, label: 'по центру' },
  { value: 'right' as const, icon: AlignEndVertical, label: 'справа' },
] satisfies readonly { value: JsonSlideTextStackAlign; icon: typeof AlignStartVertical; label: string }[];

const JUSTIFY_OPTIONS = [
  { value: 'start' as const, icon: AlignStartHorizontal, label: 'сверху' },
  { value: 'center' as const, icon: AlignCenterHorizontal, label: 'по центру' },
  { value: 'end' as const, icon: AlignEndHorizontal, label: 'снизу' },
] satisfies readonly { value: JsonSlideTextStackJustify; icon: typeof AlignStartHorizontal; label: string }[];

const GAP_OPTIONS = [
  { value: '', label: '— по умолчанию —' },
  { value: 'xs', label: 'xs' },
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
] as const;

export function StackInspector({ selection, doc, actions }: NodeInspectorProps) {
  if (actions.kind !== 'stack') return null;

  const stack = getNodeByPath(doc, selection.path) as JsonSlideTextStack | undefined;

  if (!stack) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-3 text-xs text-neutral-500">
        Стек не найден по пути{' '}
        <span className="font-mono text-neutral-300">{selection.path}</span>.
      </div>
    );
  }

  return (
    <>
      <Section title="Стек">
        <Field label="Выравнивание">
          <IconToggleRow
            value={stack.align}
            options={ALIGN_OPTIONS}
            onChange={(value) => actions.stack.updateAlign(value)}
          />
        </Field>
        <Field label="Justify">
          <IconToggleRow
            value={stack.justify}
            options={JUSTIFY_OPTIONS}
            onChange={(value) => actions.stack.updateJustify(value)}
          />
        </Field>
        <Field label="Gap">
          <Select
            value={toUiSelectValue(stack.gap ?? '')}
            onValueChange={(raw) => {
              const v = fromUiSelectValue(raw);
              actions.stack.updateGap(
                v === '' ? null : (v as NonNullable<JsonSlideTextStack['gap']>),
              );
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

      <Section title={`Items (${stack.items.length}) — только просмотр`}>
        <ol className="space-y-1.5 text-xs text-neutral-300">
          {stack.items.map((item, i) => (
            <li
              key={i}
              className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1.5"
            >
              <div className="mb-0.5 text-[10px] uppercase tracking-wide text-neutral-500">
                #{i + 1} · {summarizeKind(item)}
              </div>
              <div className="font-mono text-[11px] text-neutral-200">
                {summarizeItem(item)}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

function summarizeKind(item: JsonSlideTextStackItem): string {
  if (item.type === 'text') return `text/${item.variant}`;
  if (item.type === 'link') return 'link';
  return 'image';
}

function summarizeItem(item: JsonSlideTextStackItem): string {
  if (item.type === 'text') {
    if ('chunks' in item) return item.chunks.map((c) => c.text).join(' · ');
    return item.text;
  }
  if (item.type === 'link') return `${item.label} → ${item.href}`;
  return `${item.src}${item.alt ? ` (${item.alt})` : ''}`;
}
