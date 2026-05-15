import { useEffect, useId, useState } from 'react';
import type { CreatorSlide } from '../domain/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { SLIDE_PRESETS, type SlidePresetId, findSlidePreset } from '../templates/slidePresets';
import { useEditorStore } from './editorStore';

interface SlideTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (slide: CreatorSlide) => void;
}

const DEFAULT_PRESET_ID: SlidePresetId = 'textStackTitle';

export function SlideTypeDialog({ open, onOpenChange, onCreated }: SlideTypeDialogProps) {
  const store = useEditorStore();
  const radioName = useId();
  const [selectedId, setSelectedId] = useState<SlidePresetId>(DEFAULT_PRESET_ID);
  const [isCreating, setIsCreating] = useState(false);

  // Сброс выбора при каждом открытии модалки.
  useEffect(() => {
    if (open) {
      setSelectedId(DEFAULT_PRESET_ID);
      setIsCreating(false);
    }
  }, [open]);

  const handleCreate = async () => {
    const preset = findSlidePreset(selectedId);
    if (!preset) return;
    setIsCreating(true);
    try {
      const slide = await store.createSlide({ document: preset.build() });
      if (slide) {
        onCreated?.(slide);
        onOpenChange(false);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isCreating) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="border-neutral-800 bg-neutral-950 text-neutral-100 shadow-black/40 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-neutral-100">Новый слайд</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Выберите стартовый формат — контент потом отредактируете на сцене.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={selectedId}
          onValueChange={(value) => setSelectedId(value as SlidePresetId)}
          className="flex flex-col gap-2"
        >
          {SLIDE_PRESETS.map((preset) => {
            const id = `${radioName}-${preset.id}`;
            return (
              <Label
                key={preset.id}
                htmlFor={id}
                className="flex cursor-pointer items-start gap-3 rounded-md border border-neutral-800 p-3 transition hover:border-neutral-700 has-[[data-state=checked]]:border-sky-600 has-[[data-state=checked]]:bg-sky-950/30"
              >
                <RadioGroupItem
                  id={id}
                  value={preset.id}
                  className="mt-0.5 border-neutral-700 bg-neutral-950 text-sky-400"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-neutral-100">{preset.title}</span>
                  <span className="text-xs font-normal text-neutral-400">{preset.description}</span>
                </span>
              </Label>
            );
          })}
        </RadioGroup>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
            className="border-neutral-700 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 hover:text-neutral-100"
          >
            Отмена
          </Button>
          <Button type="button" onClick={handleCreate} disabled={isCreating}>
            {isCreating ? 'Создаём…' : 'Создать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
