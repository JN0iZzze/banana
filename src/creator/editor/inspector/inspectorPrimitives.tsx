import { useId, type ComponentType, type ReactNode, type SVGProps } from 'react';
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
    <div className="flex flex-col gap-1 text-xs text-neutral-300">
      <span className="text-[11px] font-medium text-neutral-400">{label}</span>
      {children}
    </div>
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

export type LucideLikeIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface IconToggleRowProps<T extends string> {
  value: T;
  options: readonly { value: T; icon: LucideLikeIcon; label: string }[];
  onChange: (value: T) => void;
}

/**
 * Сегментированный переключатель из icon-кнопок: выбор значения через клик
 * по иконке без radio-кругляшков. `label` уходит в `title` / `aria-label`,
 * активная кнопка подсвечена. Используется для align/justify и подобных
 * enum-полей, где иконка читается лучше слова.
 */
export function IconToggleRow<T extends string>({
  value,
  options,
  onChange,
}: IconToggleRowProps<T>) {
  return (
    <div role="radiogroup" className="flex gap-1">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => onChange(opt.value)}
            className={
              'flex h-7 w-7 items-center justify-center rounded transition-colors ' +
              (isActive
                ? 'text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-200')
            }
          >
            <Icon className="size-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
