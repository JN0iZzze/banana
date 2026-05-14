/**
 * Инспектор text-региона (`JsonSlideTextRegionPayload`) внутри
 * `splitLayout` / `stackLayout`.
 *
 * Поля строго по типу:
 *   - `align`     — `left | center | right` (опц.);
 *   - `stackGap`  — `xs | sm | md | lg`     (опц.);
 *   - `items[]`   — список текстовых строк (только просмотр; правится inline).
 */

import type { JsonSlideTextRegionPayload } from '../../../../presentation/jsonSlideTypes';
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

const ALIGN_OPTIONS = [
  { value: '', label: '— по умолчанию —' },
  { value: 'left', label: 'left' },
  { value: 'center', label: 'center' },
  { value: 'right', label: 'right' },
] as const;

const STACK_GAP_OPTIONS = [
  { value: '', label: '— по умолчанию —' },
  { value: 'xs', label: 'xs' },
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
] as const;

export function TextRegionInspector({ selection, doc, patchNode }: NodeInspectorProps) {
  const region = getNodeByPath(doc, selection.path) as JsonSlideTextRegionPayload | undefined;

  if (!region) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-3 text-xs text-neutral-500">
        Text-регион не найден по пути{' '}
        <span className="font-mono text-neutral-300">{selection.path}</span>.
      </div>
    );
  }

  const setField = <K extends keyof JsonSlideTextRegionPayload>(
    key: K,
    value: JsonSlideTextRegionPayload[K] | undefined,
  ) => {
    patchNode(selection.path, (node) => {
      const base = { ...(node as JsonSlideTextRegionPayload) };
      if (value === undefined) {
        delete base[key];
        return base;
      }
      base[key] = value;
      return base;
    });
  };

  const items = region.items ?? [];

  return (
    <>
      <Section title="Text-регион">
        <Field label="Align">
          <Select
            value={toUiSelectValue(region.align ?? '')}
            onValueChange={(raw) => {
              const v = fromUiSelectValue(raw);
              setField(
                'align',
                v === '' ? undefined : (v as NonNullable<JsonSlideTextRegionPayload['align']>),
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALIGN_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={toUiSelectValue(o.value)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Stack gap">
          <Select
            value={toUiSelectValue(region.stackGap ?? '')}
            onValueChange={(raw) => {
              const v = fromUiSelectValue(raw);
              setField(
                'stackGap',
                v === ''
                  ? undefined
                  : (v as NonNullable<JsonSlideTextRegionPayload['stackGap']>),
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STACK_GAP_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={toUiSelectValue(o.value)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Section>

      <Section title={`Строки (${items.length}) — только просмотр`}>
        {items.length === 0 ? (
          <p className="text-[11px] text-neutral-500">
            Пусто. Добавление и удаление строк — через Raw JSON.
          </p>
        ) : (
          <ol className="space-y-1.5 text-xs text-neutral-300">
            {items.map((item, i) => (
              <li
                key={i}
                className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1.5"
              >
                <div className="mb-0.5 text-[10px] uppercase tracking-wide text-neutral-500">
                  #{i + 1} · {item.variant}
                </div>
                <div className="font-mono text-[11px] text-neutral-200">{item.text}</div>
              </li>
            ))}
          </ol>
        )}
        <p className="text-[11px] leading-4 text-neutral-500">
          Сами тексты — двойной клик прямо на сцене.
        </p>
      </Section>
    </>
  );
}
