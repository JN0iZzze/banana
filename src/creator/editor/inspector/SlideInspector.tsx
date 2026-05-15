import { useCallback, useEffect, useState } from 'react';
import type { CreatorSlide } from '../../domain/types';
import type {
  JsonSlideBackdrop,
  JsonSlideBackdropVariant,
  JsonSlideContent,
  JsonSlideContentAlign,
  JsonSlideContentDensity,
  JsonSlideContentWidth,
  JsonSlideDocument,
  JsonSlideFrame,
  JsonSlideFrameAlign,
  JsonSlideFramePadding,
} from '../../../presentation/jsonSlideTypes';
import type { SlideTheme } from '../../../presentation/types';
import { useEditorStore } from '../editorStore';
import { Alert } from '../../ui/alert';
import { Input } from '../../ui/input';
import { Switch } from '../../ui/switch';
import { Textarea } from '../../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import {
  AlignCenter,
  AlignEndVertical,
  AlignLeft,
  AlignStartVertical,
  AlignCenterVertical,
} from 'lucide-react';
import {
  Field,
  IconToggleRow,
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
 *   - тонкий блок document-level `theme` (slide-level настройка).
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

  // Только default / textStack имеют frame / content / backdrop. ImageCover — нет.

  const patchWrapper = useCallback(
    (
      key: 'frame' | 'content' | 'backdrop',
      mutator: (current: object) => object,
    ) => {
      patchDoc((draft) => {
        if (draft.template !== 'default' && draft.template !== 'textStack') return draft;
        const next = { ...draft } as Record<string, unknown>;
        const current = (next[key] as object | undefined) ?? {};
        const updated = mutator({ ...current });
        if (Object.keys(updated).length === 0) {
          delete next[key];
        } else {
          next[key] = updated;
        }
        return next as unknown as JsonSlideDocument;
      });
    },
    [patchDoc],
  );

  const setOptional = <T extends object, K extends keyof T>(
    obj: T,
    key: K,
    value: T[K] | undefined,
  ): T => {
    const next = { ...obj };
    if (value === undefined) {
      delete next[key];
    } else {
      next[key] = value;
    }
    return next;
  };

  return (
    <div className="flex flex-col gap-4 text-sm">
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
          Документ невалиден. Открой JSON.
        </Alert>
      ) : (
        <>
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
          </Section>

          {doc.template === 'default' || doc.template === 'textStack' ? (
            <>
              <FrameSection
                frame={doc.frame ?? {}}
                onChange={(mutator) =>
                  patchWrapper('frame', (curr) => mutator(curr as JsonSlideFrame))
                }
                setOptional={setOptional}
              />
              <ContentSection
                content={doc.content ?? {}}
                onChange={(mutator) =>
                  patchWrapper('content', (curr) => mutator(curr as JsonSlideContent))
                }
                setOptional={setOptional}
              />
              <BackdropSection
                backdrop={doc.backdrop ?? {}}
                onChange={(mutator) =>
                  patchWrapper('backdrop', (curr) => mutator(curr as JsonSlideBackdrop))
                }
                setOptional={setOptional}
              />
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

const FRAME_ALIGN_OPTIONS = [
  { value: 'top' as const, icon: AlignStartVertical, label: 'top' },
  { value: 'center' as const, icon: AlignCenterVertical, label: 'center' },
  { value: 'bottom' as const, icon: AlignEndVertical, label: 'bottom' },
] satisfies readonly { value: JsonSlideFrameAlign; icon: typeof AlignStartVertical; label: string }[];

const FRAME_PADDING_OPTIONS = [
  { value: '', label: '— по умолчанию —' },
  { value: 'compact', label: 'compact' },
  { value: 'default', label: 'default' },
  { value: 'spacious', label: 'spacious' },
] as const;

function FrameSection({
  frame,
  onChange,
  setOptional,
}: {
  frame: JsonSlideFrame;
  onChange: (mutator: (current: JsonSlideFrame) => JsonSlideFrame) => void;
  setOptional: <T extends object, K extends keyof T>(o: T, k: K, v: T[K] | undefined) => T;
}) {
  return (
    <Section title="Frame">
      <Field label="Align">
        <IconToggleRow
          value={frame.align ?? 'center'}
          options={FRAME_ALIGN_OPTIONS}
          onChange={(value) => onChange((curr) => setOptional(curr, 'align', value))}
        />
      </Field>
      <Field label="Padding">
        <Select
          value={toUiSelectValue(frame.padding ?? '')}
          onValueChange={(raw) => {
            const v = fromUiSelectValue(raw);
            onChange((curr) =>
              setOptional(
                curr,
                'padding',
                v === '' ? undefined : (v as JsonSlideFramePadding),
              ),
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FRAME_PADDING_OPTIONS.map((o) => (
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

const CONTENT_WIDTH_OPTIONS = [
  { value: '', label: '— по умолчанию —' },
  { value: 'full', label: 'full' },
  { value: 'wide', label: 'wide' },
  { value: 'content', label: 'content' },
  { value: 'narrow', label: 'narrow' },
] as const;

const CONTENT_DENSITY_OPTIONS = [
  { value: '', label: '— по умолчанию —' },
  { value: 'compact', label: 'compact' },
  { value: 'comfortable', label: 'comfortable' },
  { value: 'relaxed', label: 'relaxed' },
] as const;

const CONTENT_ALIGN_OPTIONS = [
  { value: 'left' as const, icon: AlignLeft, label: 'слева' },
  { value: 'center' as const, icon: AlignCenter, label: 'по центру' },
] satisfies readonly { value: JsonSlideContentAlign; icon: typeof AlignLeft; label: string }[];

function ContentSection({
  content,
  onChange,
  setOptional,
}: {
  content: JsonSlideContent;
  onChange: (mutator: (current: JsonSlideContent) => JsonSlideContent) => void;
  setOptional: <T extends object, K extends keyof T>(o: T, k: K, v: T[K] | undefined) => T;
}) {
  return (
    <Section title="Content">
      <Field label="Width">
        <Select
          value={toUiSelectValue(content.width ?? '')}
          onValueChange={(raw) => {
            const v = fromUiSelectValue(raw);
            onChange((curr) =>
              setOptional(
                curr,
                'width',
                v === '' ? undefined : (v as JsonSlideContentWidth),
              ),
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONTENT_WIDTH_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={toUiSelectValue(o.value)}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Density">
        <Select
          value={toUiSelectValue(content.density ?? '')}
          onValueChange={(raw) => {
            const v = fromUiSelectValue(raw);
            onChange((curr) =>
              setOptional(
                curr,
                'density',
                v === '' ? undefined : (v as JsonSlideContentDensity),
              ),
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONTENT_DENSITY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={toUiSelectValue(o.value)}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Align">
        <IconToggleRow
          value={content.align ?? 'left'}
          options={CONTENT_ALIGN_OPTIONS}
          onChange={(value) => onChange((curr) => setOptional(curr, 'align', value))}
        />
      </Field>
    </Section>
  );
}

const BACKDROP_VARIANT_OPTIONS: { value: JsonSlideBackdropVariant; label: string }[] = [
  { value: 'none', label: 'none' },
  { value: 'grid', label: 'grid' },
  { value: 'mesh', label: 'mesh' },
  { value: 'spotlight', label: 'spotlight' },
];

function BackdropSection({
  backdrop,
  onChange,
  setOptional,
}: {
  backdrop: JsonSlideBackdrop;
  onChange: (mutator: (current: JsonSlideBackdrop) => JsonSlideBackdrop) => void;
  setOptional: <T extends object, K extends keyof T>(o: T, k: K, v: T[K] | undefined) => T;
}) {
  return (
    <Section title="Backdrop">
      <Field label="Variant">
        <Select
          value={backdrop.variant ?? 'none'}
          onValueChange={(value) =>
            onChange((curr) =>
              setOptional(curr, 'variant', value as JsonSlideBackdropVariant),
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BACKDROP_VARIANT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Border frame">
        <Switch
          checked={backdrop.borderFrame === true}
          onCheckedChange={(checked) =>
            onChange((curr) => setOptional(curr, 'borderFrame', checked ? true : undefined))
          }
        />
      </Field>
      <Field label="Dimmed (для spotlight)">
        <Switch
          checked={backdrop.dimmed === true}
          onCheckedChange={(checked) =>
            onChange((curr) => setOptional(curr, 'dimmed', checked ? true : undefined))
          }
        />
      </Field>
    </Section>
  );
}
