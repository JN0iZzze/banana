import { useMemo, useState } from 'react';
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
  onDuplicate: () => void;
  onDelete: () => void;
}

function SortableSlideRow({
  slide,
  index,
  isActive,
  onSelect,
  onToggleHidden,
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

  const title = slide.title && slide.title.trim().length > 0 ? slide.title : 'Без названия';
  const isInvalid = slide.validation.status === 'invalid';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`touch-none border-b border-neutral-800 ${
        isActive ? 'bg-neutral-800/80' : 'hover:bg-neutral-900'
      } ${isDragging ? 'relative z-10 opacity-60 shadow-lg' : ''}`}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span className="w-6 shrink-0 text-xs tabular-nums text-neutral-500">
            {index + 1}
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
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            title={slide.hidden ? 'Показать' : 'Скрыть'}
            aria-label={slide.hidden ? 'Показать' : 'Скрыть'}
            onClick={onToggleHidden}
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
