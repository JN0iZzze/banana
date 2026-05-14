import { useId, type ReactNode } from 'react';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';

/**
 * Общие layout-примитивы инспектора: рамочные секции и подписанные поля.
 * Используются `SlideInspector`'ом и всеми node-инспекторами из реестра, чтобы
 * правая панель имела единый стиль и не плодила варианты.
 */

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-md border border-neutral-800 bg-neutral-900/30 p-3">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-neutral-300">
      <span className="text-[11px] font-medium text-neutral-400">{label}</span>
      {children}
    </label>
  );
}

/**
 * Radix Select запрещает SelectItem value="". Используем sentinel для "пустого"
 * выбора и мапим его в "" в onValueChange/value.
 */
export const NONE_SENTINEL = '__none__';
export const toUiSelectValue = (value: string): string => (value === '' ? NONE_SENTINEL : value);
export const fromUiSelectValue = (value: string): string =>
  value === NONE_SENTINEL ? '' : value;

interface RadioRowProps<T extends string> {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}

/**
 * Горизонтальная RadioGroup для коротких enum-полей (align: left/center и т.п.).
 * Локальный `useId` гарантирует уникальные id даже при двух одинаковых группах
 * на одной форме.
 */
export function RadioRow<T extends string>({ value, options, onChange }: RadioRowProps<T>) {
  const baseId = useId();
  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onChange(next as T)}
      className="flex gap-4"
    >
      {options.map((opt) => {
        const id = `${baseId}-${opt.value}`;
        return (
          <div key={opt.value} className="flex items-center gap-1.5">
            <RadioGroupItem id={id} value={opt.value} />
            <Label htmlFor={id} className="text-xs font-normal text-neutral-200">
              {opt.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
