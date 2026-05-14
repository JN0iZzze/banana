import { useCallback, useEffect, useState } from 'react';
import type { CreatorSlide } from '../../domain/types';
import type { JsonSlideDocument } from '../../../presentation/jsonSlideTypes';
import type { SlideTheme } from '../../../presentation/types';
import { useEditorStore } from '../editorStore';
import { Alert } from '../../ui/alert';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import {
  Field,
  Section,
  fromUiSelectValue,
  toUiSelectValue,
} from './inspectorPrimitives';

const THEME_OPTIONS: { value: SlideTheme | ''; label: string }[] = [
  { value: '', label: '— не задано —' },
  { value: 'editorial', label: 'editorial' },
  { value: 'signal', label: 'signal' },
  { value: 'cinema', label: 'cinema' },
];

interface SlideInspectorProps {
  slide: CreatorSlide;
}

/**
 * Инспектор уровня слайда. Содержит:
 *   - служебные метаданные (`title`, `speakerNotes`);
 *   - тонкий блок document-level `theme` (slide-level настройка);
 *   - подсказка про текущий `template` (смена ломает структуру — Raw JSON).
 *
 * Все узловые секции (header / card / quote / textRegion / layout / imageCover…)
 * рендерит `NodeInspector` через реестр. Здесь template-routing'а нет — это
 * был legacy слой, удалённый в Этапе 7.
 */
export function SlideInspector({ slide }: SlideInspectorProps) {
  const store = useEditorStore();

  // --- Meta (title / speakerNotes) ------------------------------------------
  const [titleDraft, setTitleDraft] = useState<string>(slide.title ?? '');
  const [notesDraft, setNotesDraft] = useState<string>(slide.speakerNotes ?? '');

  // Синхронизация при смене выбранного слайда.
  useEffect(() => {
    setTitleDraft(slide.title ?? '');
  }, [slide.id, slide.title]);
  useEffect(() => {
    setNotesDraft(slide.speakerNotes ?? '');
  }, [slide.id, slide.speakerNotes]);

  const commitTitle = useCallback(() => {
    const next = titleDraft.trim();
    const current = slide.title ?? '';
    if (next === current) return;
    void store.updateSlideMeta(slide.id, { title: next.length > 0 ? next : null });
  }, [titleDraft, slide.id, slide.title, store]);

  const commitNotes = useCallback(() => {
    const next = notesDraft;
    const current = slide.speakerNotes ?? '';
    if (next === current) return;
    void store.updateSlideMeta(slide.id, {
      speakerNotes: next.length > 0 ? next : null,
    });
  }, [notesDraft, slide.id, slide.speakerNotes, store]);

  // --- Document-level fields (only when validation is ok) -------------------
  const doc = slide.validation.status === 'valid' ? slide.validation.doc : null;

  const patchDoc = useCallback(
    (mutator: (draft: JsonSlideDocument) => JsonSlideDocument) => {
      if (!doc) return;
      const next = mutator(doc);
      store.updateSlideDocument(slide.id, next);
    },
    [doc, slide.id, store],
  );

  const theme = doc?.theme ?? '';
  const template = doc?.template ?? 'default';

  return (
    <div className="flex flex-col gap-4 text-sm">
      <p className="rounded-md border border-neutral-800 bg-neutral-900/40 px-3 py-2 text-[11px] leading-4 text-neutral-400">
        Текст редактируется прямо на слайде. Выбери блок на сцене, чтобы открыть
        его инспектор. Здесь — только настройки слайда целиком.
        Невалидный документ чинится через <span className="text-neutral-200">JSON</span>.
      </p>

      <Section title="Служебное">
        <Field label="Заголовок слайда (не публикуется)">
          <Input
            type="text"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.target as HTMLInputElement).blur();
              }
            }}
            size="sm"
            className="w-full"
            placeholder="Для навигации в списке слайдов"
          />
        </Field>
        <Field label="Заметки для докладчика">
          <Textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            onBlur={commitNotes}
            size="sm"
            className="w-full resize-y font-mono"
            rows={3}
          />
        </Field>
      </Section>

      {!doc ? (
        <Alert variant="destructive" className="p-3">
          Документ невалиден, поля недоступны. Правь в Raw JSON.
        </Alert>
      ) : (
        <Section title="Документ">
          <Field label="Тема (theme)">
            <Select
              value={toUiSelectValue(theme)}
              onValueChange={(raw) => {
                const value = fromUiSelectValue(raw);
                patchDoc((draft) => {
                  const next = { ...draft } as JsonSlideDocument;
                  if (value === '') {
                    delete (next as { theme?: SlideTheme }).theme;
                  } else {
                    (next as { theme?: SlideTheme }).theme = value as SlideTheme;
                  }
                  return next;
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {THEME_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={toUiSelectValue(o.value)}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Шаблон (template)">
            <div className="text-xs text-neutral-500">
              Текущий: <span className="text-neutral-200">{template}</span>. Смена шаблона ломает
              структуру документа — правь через Raw JSON.
            </div>
          </Field>
        </Section>
      )}
    </div>
  );
}
