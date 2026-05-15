/**
 * Geometry-инспектор лэйаута (`JsonSlideLayout`).
 *
 * Layout в Creator редактируется как самостоятельный geometry-layer (а не
 * content-блок и не wrapper): один и тот же inspector обслуживает и
 * корневой layout (`path === 'layout'`), и вложенный
 * (`<...>.region.layout`).
 *
 * Внутренняя декомпозиция держит surface расширяемой под новые
 * layout-варианты:
 *   - `BaseLayoutSection`  — общее для всех: `type` (read-only), `gap`;
 *   - `GridGeometrySection` — `uniformGrid` (`columns`), `bentoGrid`
 *     (`columns`, `rows`);
 *   - `SplitGeometrySection` — связанные `leftSpan`/`rightSpan` с жёстким
 *     инвариантом суммы `12`.
 *
 * Точки роста (`equalColumns` / `asymmetricColumns` / `stackLayout`)
 * подключаются такой же variant-specific секцией. UI вызывает доменные
 * операции через `actions.layout`; инварианты защищает action-слой
 * (`createLayoutActions`), а не этот компонент.
 */

import { useEffect, useState } from 'react';
import type {
  JsonSlideBentoLayout,
  JsonSlideLayout,
  JsonSlideSplitLayout,
  JsonSlideUniformGridLayout,
} from '../../../../presentation/jsonSlideTypes';
import type { LayoutActions } from '../../mutations/actionTypes';
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

export function LayoutInspector({ selection, doc, actions }: NodeInspectorProps) {
  const layout = getNodeByPath(doc, selection.path) as JsonSlideLayout | undefined;

  if (actions.kind !== 'layout') return null;

  if (!layout) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-3 text-xs text-neutral-500">
        Лэйаут не найден по пути{' '}
        <span className="font-mono text-neutral-300">{selection.path}</span>.
      </div>
    );
  }

  return (
    <>
      <BaseLayoutSection layout={layout} actions={actions.layout} />
      <GridGeometrySection layout={layout} actions={actions.layout} />
      <SplitGeometrySection layout={layout} actions={actions.layout} />
    </>
  );
}

// --- base: type + gap ------------------------------------------------------

function BaseLayoutSection({
  layout,
  actions,
}: {
  layout: JsonSlideLayout;
  actions: LayoutActions;
}) {
  return (
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
            actions.updateGap(
              v === '' ? null : (v as NonNullable<JsonSlideLayout['gap']>),
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
  );
}

// --- grid geometry: uniformGrid / bentoGrid --------------------------------

function GridGeometrySection({
  layout,
  actions,
}: {
  layout: JsonSlideLayout;
  actions: LayoutActions;
}) {
  if (layout.type === 'uniformGrid') {
    return (
      <Section title="uniformGrid">
        <Field label="Columns">
          <NumberInput
            value={(layout as JsonSlideUniformGridLayout).columns}
            min={1}
            onCommit={(n) => actions.updateColumns(n)}
          />
        </Field>
      </Section>
    );
  }

  if (layout.type === 'bentoGrid') {
    const bento = layout as JsonSlideBentoLayout;
    return (
      <Section title="bentoGrid">
        <Field label="Columns">
          <NumberInput
            value={bento.columns}
            min={1}
            onCommit={(n) => actions.updateColumns(n)}
          />
        </Field>
        <Field label="Rows">
          <NumberInput
            value={bento.rows}
            min={1}
            onCommit={(n) => actions.updateRows(n)}
          />
        </Field>
      </Section>
    );
  }

  return null;
}

/**
 * Числовой инпут, который коммитит только конечные числа (`Number.isFinite`).
 * Пустая строка / мусор → no-commit, как требует контракт «не писать
 * битую геометрию».
 */
function NumberInput({
  value,
  min,
  onCommit,
}: {
  value: number;
  min: number;
  onCommit: (n: number) => void;
}) {
  return (
    <Input
      type="number"
      min={min}
      value={value}
      onChange={(e) => {
        const parsed = Number(e.target.value);
        if (!Number.isFinite(parsed)) return;
        onCommit(parsed);
      }}
      size="sm"
      className="w-full"
    />
  );
}

// --- split geometry: linked left/right with sum invariant ------------------

const SPLIT_MIN = 1;
const SPLIT_MAX = 11;
const SPLIT_TOTAL = 12;

/**
 * Связанный контрол пропорций `splitLayout`.
 *
 * Поведение (Stage 4 плана):
 *   - два поля `Left span` / `Right span` связаны: правка одного
 *     немедленно пересчитывает второе как `12 - x`;
 *   - допустимый диапазон каждого поля — `1..11`;
 *   - невалидный ввод не коммитится (action-слой всё равно защитит
 *     инвариант, но и UI не отправляет заведомо битую пару);
 *   - read-only summary `N / M` + hint, что сумма всегда `12`.
 *
 * Локальные draft-стейты нужны, чтобы поле не «дёргалось» во время
 * набора (например, пустая строка между цифрами) и переинициализировались
 * при смене выделенного layout-а / внешней правке документа.
 */
function SplitGeometrySection({
  layout,
  actions,
}: {
  layout: JsonSlideLayout;
  actions: LayoutActions;
}) {
  if (layout.type !== 'splitLayout') return null;
  return (
    <SplitControls
      split={layout as JsonSlideSplitLayout}
      onChangeLeft={(left) =>
        actions.updateSplitSpans({ left, right: SPLIT_TOTAL - left })
      }
    />
  );
}

function SplitControls({
  split,
  onChangeLeft,
}: {
  split: JsonSlideSplitLayout;
  onChangeLeft: (left: number) => void;
}) {
  const { leftSpan, rightSpan } = split;
  const [leftDraft, setLeftDraft] = useState<string>(String(leftSpan));
  const [rightDraft, setRightDraft] = useState<string>(String(rightSpan));

  // Ресинк при смене выбранного layout-а или внешней правке документа.
  useEffect(() => {
    setLeftDraft(String(leftSpan));
    setRightDraft(String(rightSpan));
  }, [leftSpan, rightSpan]);

  const isValidSpan = (n: number) =>
    Number.isInteger(n) && n >= SPLIT_MIN && n <= SPLIT_MAX;

  const handleLeft = (raw: string) => {
    setLeftDraft(raw);
    const parsed = Number(raw);
    if (!isValidSpan(parsed)) return;
    setRightDraft(String(SPLIT_TOTAL - parsed));
    onChangeLeft(parsed);
  };

  const handleRight = (raw: string) => {
    setRightDraft(raw);
    const parsed = Number(raw);
    if (!isValidSpan(parsed)) return;
    const left = SPLIT_TOTAL - parsed;
    setLeftDraft(String(left));
    onChangeLeft(left);
  };

  // На blur сбрасываем draft к актуальному документу, чтобы невалидный
  // промежуточный ввод не «застревал» в поле.
  const resyncDrafts = () => {
    setLeftDraft(String(leftSpan));
    setRightDraft(String(rightSpan));
  };

  return (
    <Section title="splitLayout">
      <Field label="Left span">
        <Input
          type="number"
          min={SPLIT_MIN}
          max={SPLIT_MAX}
          value={leftDraft}
          onChange={(e) => handleLeft(e.target.value)}
          onBlur={resyncDrafts}
          size="sm"
          className="w-full"
        />
      </Field>
      <Field label="Right span">
        <Input
          type="number"
          min={SPLIT_MIN}
          max={SPLIT_MAX}
          value={rightDraft}
          onChange={(e) => handleRight(e.target.value)}
          onBlur={resyncDrafts}
          size="sm"
          className="w-full"
        />
      </Field>
      <div className="flex items-center justify-between text-[11px] leading-4 text-neutral-500">
        <span>Сумма всегда {SPLIT_TOTAL} · диапазон {SPLIT_MIN}–{SPLIT_MAX}.</span>
        <span className="font-mono text-neutral-300">
          {leftSpan} / {rightSpan}
        </span>
      </div>
    </Section>
  );
}
