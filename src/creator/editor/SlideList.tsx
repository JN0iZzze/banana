import { useMemo } from 'react';
import type { CreatorSlide } from '../domain/types';
import { useEditorStore } from './editorStore';

interface SlideListProps {
  onSelect: (slideId: string) => void;
}

export function SlideList({ onSelect }: SlideListProps) {
  const store = useEditorStore();
  const deck = store.deck;

  const sorted = useMemo<CreatorSlide[]>(() => {
    if (!deck) return [];
    return [...deck.slides].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [deck]);

  if (!deck) return null;

  if (sorted.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-neutral-400">В деке пока нет слайдов</p>
        <button
          type="button"
          onClick={() => void store.createSlide()}
          className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          Создать первый слайд
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ul className="flex-1 overflow-y-auto">
        {sorted.map((slide, idx) => {
          const isActive = store.selectedSlideId === slide.id;
          const isFirst = idx === 0;
          const isLast = idx === sorted.length - 1;
          const isInvalid = slide.validation.status === 'invalid';
          const title = slide.title && slide.title.trim().length > 0 ? slide.title : 'Без названия';

          return (
            <li
              key={slide.id}
              className={`border-b border-neutral-800 ${
                isActive ? 'bg-neutral-800/80' : 'hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  type="button"
                  onClick={() => onSelect(slide.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="w-6 shrink-0 text-xs tabular-nums text-neutral-500">
                    {idx + 1}
                  </span>
                  {isInvalid ? (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-red-500"
                      title="Невалидный JSON"
                    />
                  ) : null}
                  {slide.hidden ? (
                    <span title="Скрыт" className="shrink-0 text-neutral-500">
                      {hiddenIcon}
                    </span>
                  ) : null}
                  <span
                    className={`truncate text-sm ${
                      slide.hidden ? 'text-neutral-500 line-through' : 'text-neutral-100'
                    }`}
                  >
                    {title}
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-0.5">
                  <IconButton
                    label="Вверх"
                    disabled={isFirst}
                    onClick={() => void store.moveSlideUp(slide.id)}
                  >
                    ↑
                  </IconButton>
                  <IconButton
                    label="Вниз"
                    disabled={isLast}
                    onClick={() => void store.moveSlideDown(slide.id)}
                  >
                    ↓
                  </IconButton>
                  <IconButton
                    label="Дублировать"
                    onClick={() => void store.duplicateSlide(slide.id)}
                  >
                    ⧉
                  </IconButton>
                  <IconButton
                    label={slide.hidden ? 'Показать' : 'Скрыть'}
                    onClick={() => void store.setSlideHidden(slide.id, !slide.hidden)}
                  >
                    {slide.hidden ? '○' : '●'}
                  </IconButton>
                  <IconButton
                    label="Удалить"
                    tone="danger"
                    onClick={() => {
                      if (window.confirm(`Удалить слайд «${title}»?`)) {
                        void store.deleteSlide(slide.id);
                      }
                    }}
                  >
                    ×
                  </IconButton>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-neutral-800 p-3">
        <button
          type="button"
          onClick={() => void store.createSlide()}
          className="w-full rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          + Слайд
        </button>
      </div>
    </div>
  );
}

interface IconButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: 'default' | 'danger';
  children: React.ReactNode;
}

function IconButton({ label, onClick, disabled, tone = 'default', children }: IconButtonProps) {
  const base =
    'inline-flex h-6 w-6 items-center justify-center rounded text-xs transition disabled:cursor-not-allowed disabled:opacity-30';
  const toneCls =
    tone === 'danger'
      ? 'text-neutral-400 hover:bg-red-950/60 hover:text-red-300'
      : 'text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100';
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${toneCls}`}
    >
      {children}
    </button>
  );
}

const hiddenIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3l18 18" />
    <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
    <path d="M9.88 4.26A9.77 9.77 0 0 1 12 4c7 0 10 8 10 8a18.3 18.3 0 0 1-2.16 3.19" />
    <path d="M6.1 6.1A18.4 18.4 0 0 0 2 12s3 8 10 8a9.7 9.7 0 0 0 4.24-.96" />
  </svg>
);
