import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CreatorSlide } from '../../domain/types';
import type {
  JsonSlideBackdrop,
  JsonSlideBackdropVariant,
  JsonSlideContent,
  JsonSlideContentAlign,
  JsonSlideContentDensity,
  JsonSlideContentWidth,
  JsonSlideFrame,
  JsonSlideFrameAlign,
  JsonSlideFramePadding,
} from '../../../presentation/jsonSlideTypes';
import { isJsonSlideWrapperDocument } from '../../../presentation/jsonSlideTypes';
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
import {
  createSlideActions,
  patchOptionalField,
  type SlideActions,
} from '../mutations';

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
 *
 * Все правки идут через `SlideActions` (см. `mutations/slideActions.ts`):
 * прямых вызовов `store.updateSlideMeta` / `store.updateSlideDocument` в этом
 * файле нет.
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

  // --- Document-level fields (only when validation is ok) -------------------
  const doc = slide.validation.status === 'valid' ? slide.validation.doc : null;

  // Actions собираем только при валидном документе. Title / speakerNotes
  // тоже пробрасываются через эти actions — отдельная meta-only фабрика
  // не нужна, доступ к doc для meta-операций просто не используется.
  const actions = useMemo<SlideActions | null>(() => {
    if (!doc) return null;
    return createSlideActions({ slideId: slide.id, doc, store });
  }, [slide.id, doc, store]);

  const commitTitle = useCallback(() => {
    const next = titleDraft.trim();
    const current = slide.title ?? '';
    if (next === current) return;
    if (!actions) return;
    actions.updateTitle(next.length > 0 ? next : null);
  }, [actions, titleDraft, slide.title]);

  const commitNotes = useCallback(() => {
    const next = notesDraft;
    const current = slide.speakerNotes ?? '';
    if (next === current) return;
    if (!actions) return;
    actions.updateSpeakerNotes(next.length > 0 ? next : null);
  }, [actions, notesDraft, slide.speakerNotes]);

  const theme = doc?.theme ?? '';

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

      {!doc || !actions ? (
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
                  actions.updateTheme(value === '' ? null : (value as SlideTheme));
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

          {isJsonSlideWrapperDocument(doc) ? (
            <>
              <FrameSection
                frame={doc.frame ?? {}}
                onChange={(mutator) => actions.updateFrame(mutator)}
              />
              <ContentSection
                content={doc.content ?? {}}
                onChange={(mutator) => actions.updateContent(mutator)}
              />
              <BackdropSection
                backdrop={doc.backdrop ?? {}}
                onChange={(mutator) => actions.updateBackdrop(mutator)}
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
}: {
  frame: JsonSlideFrame;
  onChange: (mutator: (current: JsonSlideFrame) => JsonSlideFrame) => void;
}) {
  return (
    <Section title="Frame">
      <Field label="Align">
        <IconToggleRow
          value={frame.align ?? 'center'}
          options={FRAME_ALIGN_OPTIONS}
          onChange={(value) =>
            onChange((curr) => patchOptionalField(curr, 'align', value))
          }
        />
      </Field>
      <Field label="Padding">
        <Select
          value={toUiSelectValue(frame.padding ?? '')}
          onValueChange={(raw) => {
            const v = fromUiSelectValue(raw);
            onChange((curr) =>
              patchOptionalField(
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
}: {
  content: JsonSlideContent;
  onChange: (mutator: (current: JsonSlideContent) => JsonSlideContent) => void;
}) {
  return (
    <Section title="Content">
      <Field label="Width">
        <Select
          value={toUiSelectValue(content.width ?? '')}
          onValueChange={(raw) => {
            const v = fromUiSelectValue(raw);
            onChange((curr) =>
              patchOptionalField(
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
              patchOptionalField(
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
          onChange={(value) =>
            onChange((curr) => patchOptionalField(curr, 'align', value))
          }
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
}: {
  backdrop: JsonSlideBackdrop;
  onChange: (mutator: (current: JsonSlideBackdrop) => JsonSlideBackdrop) => void;
}) {
  return (
    <Section title="Backdrop">
      <Field label="Variant">
        <Select
          value={backdrop.variant ?? 'none'}
          onValueChange={(value) =>
            onChange((curr) =>
              patchOptionalField(curr, 'variant', value as JsonSlideBackdropVariant),
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
            onChange((curr) =>
              patchOptionalField(curr, 'borderFrame', checked ? true : undefined),
            )
          }
        />
      </Field>
      <Field label="Dimmed (для spotlight)">
        <Switch
          checked={backdrop.dimmed === true}
          onCheckedChange={(checked) =>
            onChange((curr) =>
              patchOptionalField(curr, 'dimmed', checked ? true : undefined),
            )
          }
        />
      </Field>
    </Section>
  );
}
