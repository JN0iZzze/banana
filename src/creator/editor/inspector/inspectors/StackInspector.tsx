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
  RadioRow,
  Section,
  fromUiSelectValue,
  toUiSelectValue,
} from '../inspectorPrimitives';
import { getNodeByPath } from '../pathOps';
import type { NodeInspectorProps } from '../registry';

const ALIGN_OPTIONS: { value: JsonSlideTextStackAlign; label: string }[] = [
  { value: 'left', label: 'слева' },
  { value: 'center', label: 'по центру' },
  { value: 'right', label: 'справа' },
];

const JUSTIFY_OPTIONS: { value: JsonSlideTextStackJustify; label: string }[] = [
  { value: 'start', label: 'сверху' },
  { value: 'center', label: 'по центру' },
  { value: 'end', label: 'снизу' },
];

const GAP_OPTIONS = [
  { value: '', label: '— по умолчанию —' },
  { value: 'xs', label: 'xs' },
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
] as const;

export function StackInspector({ selection, doc, patchNode }: NodeInspectorProps) {
  const stack = getNodeByPath(doc, selection.path) as JsonSlideTextStack | undefined;

  if (!stack) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-3 text-xs text-neutral-500">
        Стек не найден по пути{' '}
        <span className="font-mono text-neutral-300">{selection.path}</span>.
      </div>
    );
  }

  const setField = <K extends keyof JsonSlideTextStack>(
    key: K,
    value: JsonSlideTextStack[K] | undefined,
  ) => {
    patchNode(selection.path, (node) => {
      const base = { ...(node as JsonSlideTextStack) };
      if (value === undefined) {
        delete base[key];
        return base;
      }
      base[key] = value;
      return base;
    });
  };

  return (
    <>
      <Section title="Стек">
        <Field label="Выравнивание">
          <RadioRow
            value={stack.align}
            options={ALIGN_OPTIONS}
            onChange={(value) => setField('align', value)}
          />
        </Field>
        <Field label="Justify">
          <RadioRow
            value={stack.justify}
            options={JUSTIFY_OPTIONS}
            onChange={(value) => setField('justify', value)}
          />
        </Field>
        <Field label="Gap">
          <Select
            value={toUiSelectValue(stack.gap ?? '')}
            onValueChange={(raw) => {
              const v = fromUiSelectValue(raw);
              setField(
                'gap',
                v === '' ? undefined : (v as NonNullable<JsonSlideTextStack['gap']>),
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
        <p className="text-[11px] leading-4 text-neutral-500">
          Тексты — двойной клик по строке прямо на сцене.
        </p>
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
        <p className="text-[11px] leading-4 text-neutral-500">
          Добавление и порядок правим через Raw JSON.
        </p>
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
