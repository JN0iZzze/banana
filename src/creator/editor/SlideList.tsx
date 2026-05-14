import { useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  Trash2,
} from 'lucide-react';
import type { CreatorSlide } from '../domain/types';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
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
        <Button type="button" onClick={() => void store.createSlide()}>
          <Plus />
          Создать первый слайд
        </Button>
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
                    <EyeOff
                      className="size-3.5 shrink-0 text-neutral-500"
                      aria-label="Скрыт"
                    />
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
                    <ChevronUp />
                  </IconButton>
                  <IconButton
                    label="Вниз"
                    disabled={isLast}
                    onClick={() => void store.moveSlideDown(slide.id)}
                  >
                    <ChevronDown />
                  </IconButton>
                  <IconButton
                    label={slide.hidden ? 'Показать' : 'Скрыть'}
                    onClick={() => void store.setSlideHidden(slide.id, !slide.hidden)}
                  >
                    {slide.hidden ? <EyeOff /> : <Eye />}
                  </IconButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        title="Ещё"
                        aria-label="Ещё"
                        className="text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100"
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onSelect={() => void store.duplicateSlide(slide.id)}
                      >
                        <Copy />
                        Дублировать
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => {
                          if (window.confirm(`Удалить слайд «${title}»?`)) {
                            void store.deleteSlide(slide.id);
                          }
                        }}
                      >
                        <Trash2 />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-neutral-800 p-3">
        <Button type="button" className="w-full" onClick={() => void store.createSlide()}>
          <Plus />
          Слайд
        </Button>
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
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={
        tone === 'danger'
          ? 'text-neutral-400 hover:bg-red-950/60 hover:text-red-300'
          : 'text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100'
      }
    >
      {children}
    </Button>
  );
}
