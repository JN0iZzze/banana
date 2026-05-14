/**
 * Инспектор карточки (`JsonSlideCard`).
 *
 * Поля строго по типу `JsonSlideCard` из `presentation/jsonSlideTypes.ts`:
 *   - `tone`     — `standard | accent`;
 *   - `padding`  — `compact | default | spacious` (опц.);
 *   - `surface`  — `box | ghost | accentGradient` (опц.);
 *   - `stackGap` — `xs | sm | md | lg` (опц.);
 *   - `justify`  — `start | end | between` (опц.).
 *
 * `items` / `slots` показываем как summary (число + краткий текст), без
 * полноценного редактирования — это волна 2.
 *
 * Тексты карточки правятся inline на сцене.
 */

import type {
  JsonSlideCard,
  JsonSlideCardItem,
  JsonSlideCardSlot,
} from '../../../../presentation/jsonSlideTypes';
import {
  isJsonSlideCardItemFeatureList,
  isJsonSlideCardItemIndexedList,
  isJsonSlideCardItemTagList,
  isJsonSlideCardItemText,
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
  Section,
  fromUiSelectValue,
  toUiSelectValue,
} from '../inspectorPrimitives';
import { getNodeByPath } from '../pathOps';
import type { NodeInspectorProps } from '../registry';

const TONE_OPTIONS = [
  { value: 'standard', label: 'standard' },
  { value: 'accent', label: 'accent' },
] as const;

const PADDING_OPTIONS = [
  { value: '', label: '— по умолчанию —' },
  { value: 'compact', label: 'compact' },
  { value: 'default', label: 'default' },
  { value: 'spacious', label: 'spacious' },
] as const;

const SURFACE_OPTIONS = [
  { value: '', label: '— по умолчанию —' },
  { value: 'box', label: 'box' },
  { value: 'ghost', label: 'ghost' },
  { value: 'accentGradient', label: 'accentGradient' },
] as const;

const STACK_GAP_OPTIONS = [
  { value: '', label: '— по умолчанию —' },
  { value: 'xs', label: 'xs' },
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
] as const;

const JUSTIFY_OPTIONS = [
  { value: '', label: '— по умолчанию —' },
  { value: 'start', label: 'start' },
  { value: 'end', label: 'end' },
  { value: 'between', label: 'between' },
] as const;

export function CardInspector({ selection, doc, patchNode }: NodeInspectorProps) {
  const card = getNodeByPath(doc, selection.path) as JsonSlideCard | undefined;

  if (!card) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-3 text-xs text-neutral-500">
        Карточка не найдена по пути{' '}
        <span className="font-mono text-neutral-300">{selection.path}</span>.
      </div>
    );
  }

  const setField = <K extends keyof JsonSlideCard>(key: K, value: JsonSlideCard[K] | undefined) => {
    patchNode(selection.path, (node) => {
      const base = { ...(node as JsonSlideCard) };
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
      <Section title="Карточка">
        <Field label="Tone">
          <Select
            value={card.tone}
            onValueChange={(value) => setField('tone', value as JsonSlideCard['tone'])}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Surface">
          <Select
            value={toUiSelectValue(card.surface ?? '')}
            onValueChange={(raw) => {
              const v = fromUiSelectValue(raw);
              setField(
                'surface',
                v === '' ? undefined : (v as NonNullable<JsonSlideCard['surface']>),
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SURFACE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={toUiSelectValue(o.value)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Padding">
          <Select
            value={toUiSelectValue(card.padding ?? '')}
            onValueChange={(raw) => {
              const v = fromUiSelectValue(raw);
              setField(
                'padding',
                v === '' ? undefined : (v as NonNullable<JsonSlideCard['padding']>),
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PADDING_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={toUiSelectValue(o.value)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Stack gap">
          <Select
            value={toUiSelectValue(card.stackGap ?? '')}
            onValueChange={(raw) => {
              const v = fromUiSelectValue(raw);
              setField(
                'stackGap',
                v === '' ? undefined : (v as NonNullable<JsonSlideCard['stackGap']>),
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
        <Field label="Justify">
          <Select
            value={toUiSelectValue(card.justify ?? '')}
            onValueChange={(raw) => {
              const v = fromUiSelectValue(raw);
              setField(
                'justify',
                v === '' ? undefined : (v as NonNullable<JsonSlideCard['justify']>),
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {JUSTIFY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={toUiSelectValue(o.value)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <p className="text-[11px] leading-4 text-neutral-500">
          Тексты карточки — двойной клик по нужной строке прямо на сцене.
        </p>
      </Section>

      <CardItemsSummary card={card} />
    </>
  );
}

function CardItemsSummary({ card }: { card: JsonSlideCard }) {
  if (card.slots && card.slots.length > 0) {
    return (
      <Section title={`Слоты (${card.slots.length}) — только просмотр`}>
        <ol className="space-y-1.5 text-xs text-neutral-300">
          {card.slots.map((slot, si) => (
            <li
              key={si}
              className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1.5"
            >
              <div className="mb-0.5 text-[10px] uppercase tracking-wide text-neutral-500">
                slot #{si + 1} · {slot.items.length} items
              </div>
              <SlotPreview slot={slot} />
            </li>
          ))}
        </ol>
        <p className="text-[11px] leading-4 text-neutral-500">
          Структуру слотов правим через Raw JSON.
        </p>
      </Section>
    );
  }

  const items = card.items ?? [];
  return (
    <Section title={`Items (${items.length}) — только просмотр`}>
      {items.length === 0 ? (
        <p className="text-[11px] text-neutral-500">Пусто. Добавление — через Raw JSON.</p>
      ) : (
        <ol className="space-y-1.5 text-xs text-neutral-300">
          {items.map((item, i) => (
            <li
              key={i}
              className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1.5"
            >
              <div className="mb-0.5 text-[10px] uppercase tracking-wide text-neutral-500">
                #{i + 1} · {summarizeCardItemKind(item)}
              </div>
              <div className="font-mono text-[11px] text-neutral-200">
                {summarizeCardItem(item)}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}

function SlotPreview({ slot }: { slot: JsonSlideCardSlot }) {
  return (
    <ul className="space-y-1">
      {slot.items.map((item, i) => (
        <li key={i} className="font-mono text-[11px] text-neutral-200">
          <span className="text-neutral-500">{summarizeCardItemKind(item)}: </span>
          {summarizeCardItem(item)}
        </li>
      ))}
    </ul>
  );
}

function summarizeCardItemKind(item: JsonSlideCardItem): string {
  if (isJsonSlideCardItemText(item)) return `text/${item.variant}`;
  if (isJsonSlideCardItemTagList(item)) return 'tagList';
  if (isJsonSlideCardItemIndexedList(item)) return 'indexedList';
  if (isJsonSlideCardItemFeatureList(item)) return 'featureList';
  return 'unknown';
}

function summarizeCardItem(item: JsonSlideCardItem): string {
  if (isJsonSlideCardItemText(item)) return item.text;
  if (isJsonSlideCardItemTagList(item)) {
    return item.items.map((t) => t.label).join(', ');
  }
  if (isJsonSlideCardItemIndexedList(item)) {
    return item.items.map((t) => `${t.index}. ${t.title}`).join(' / ');
  }
  if (isJsonSlideCardItemFeatureList(item)) {
    return item.items.map((t) => `${t.label}: ${t.value}`).join(' / ');
  }
  return '';
}
