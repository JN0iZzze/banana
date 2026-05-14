import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import { SlideTypeDialog } from './SlideTypeDialog';

interface SlideListProps {
  onSelect: (slideId: string) => void;
}

export function SlideList({ onSelect }: SlideListProps) {
  const store = useEditorStore();
  const deck = store.deck;
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const sorted = useMemo<CreatorSlide[]>(() => {
    if (!deck) return [];
    return [...deck.slides].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [deck]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (!deck) return null;

  if (sorted.length === 0) {
    return (
      <>
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-neutral-400">В деке пока нет слайдов</p>
          <Button type="button" onClick={() => setCreateDialogOpen(true)}>
            <Plus />
            Создать первый слайд
          </Button>
        </div>
        <SlideTypeDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreated={(slide) => onSelect(slide.id)}
        />
      </>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = sorted.map((s) => s.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    const next = arrayMove(ids, oldIndex, newIndex);
    void store.reorderSlides(next);
  };

  return (
    <div className="flex h-full flex-col">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sorted.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex-1 overflow-y-auto">
            {sorted.map((slide, idx) => (
              <SortableSlideRow
                key={slide.id}
                slide={slide}
                index={idx}
                isActive={store.selectedSlideId === slide.id}
                onSelect={() => onSelect(slide.id)}
                onToggleHidden={() => void store.setSlideHidden(slide.id, !slide.hidden)}
                onRename={(title) => store.updateSlideMeta(slide.id, { title })}
                onDuplicate={() => void store.duplicateSlide(slide.id)}
                onDelete={() => {
                  const title =
                    slide.title && slide.title.trim().length > 0 ? slide.title : 'Без названия';
                  if (window.confirm(`Удалить слайд «${title}»?`)) {
                    void store.deleteSlide(slide.id);
                  }
                }}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div className="border-t border-neutral-800 p-3">
        <Button type="button" className="w-full" onClick={() => setCreateDialogOpen(true)}>
          <Plus />
          Слайд
        </Button>
      </div>
      <SlideTypeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={(slide) => onSelect(slide.id)}
      />
    </div>
  );
}

interface SortableSlideRowProps {
  slide: CreatorSlide;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onToggleHidden: () => void;
  onRename: (title: string) => Promise<void> | void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function SortableSlideRow({
  slide,
  index,
  isActive,
  onSelect,
  onToggleHidden,
  onRename,
  onDuplicate,
  onDelete,
}: SortableSlideRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const [isEditing, setIsEditing] = useState(false);
  const editRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!isEditing || !editRef.current) return;
    const el = editRef.current;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [isEditing]);

  const rawTitle = slide.title ?? '';
  const displayTitle = rawTitle.trim().length > 0 ? rawTitle : 'Без названия';
  const isInvalid = slide.validation.status === 'invalid';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const stop = (event: React.SyntheticEvent) => event.stopPropagation();

  const commitTitle = () => {
    setIsEditing(false);
    const next = (editRef.current?.textContent ?? '').trim();
    if (next === rawTitle.trim()) return;
    void onRename(next);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isEditing ? {} : listeners)}
      onClick={isEditing ? undefined : onSelect}
      onDoubleClick={(event) => {
        event.stopPropagation();
        setIsEditing(true);
      }}
      className={`touch-none border-b border-neutral-800 ${
        isActive ? 'bg-neutral-800/80' : 'hover:bg-neutral-900'
      } ${isDragging ? 'relative z-10 opacity-60 shadow-lg' : ''}`}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="w-6 shrink-0 text-xs tabular-nums text-neutral-500">
          {index + 1}
        </span>
        {isInvalid ? (
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-red-500"
            title="Невалидный JSON"
          />
        ) : null}
        {isEditing ? (
          <span
            ref={editRef}
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            role="textbox"
            aria-label="Заголовок слайда"
            onPointerDown={stop}
            onClick={stop}
            onDoubleClick={stop}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitTitle();
              } else if (event.key === 'Escape') {
                event.preventDefault();
                if (editRef.current) editRef.current.textContent = rawTitle;
                setIsEditing(false);
              }
            }}
            onBlur={commitTitle}
            className={`min-w-0 flex-1 truncate text-sm outline-none ${
              slide.hidden ? 'text-neutral-500 line-through' : 'text-neutral-100'
            }`}
          >
            {rawTitle}
          </span>
        ) : (
          <span
            className={`min-w-0 flex-1 truncate text-sm ${
              slide.hidden ? 'text-neutral-500 line-through' : 'text-neutral-100'
            }`}
          >
            {displayTitle}
          </span>
        )}
        <div
          className="flex shrink-0 items-center gap-0.5"
          onPointerDown={stop}
          onClick={stop}
          onDoubleClick={stop}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            title={slide.hidden ? 'Показать' : 'Скрыть'}
            aria-label={slide.hidden ? 'Показать' : 'Скрыть'}
            onClick={(event) => {
              event.stopPropagation();
              onToggleHidden();
            }}
            className="text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100"
          >
            {slide.hidden ? <EyeOff /> : <Eye />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                title="Ещё"
                aria-label="Ещё"
                onClick={stop}
                className="text-neutral-400 hover:bg-neutral-700 hover:text-neutral-100"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onSelect={onDuplicate}>
                <Copy />
                Дублировать
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={onDelete}>
                <Trash2 />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </li>
  );
}
