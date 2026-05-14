import { useCallback, useEffect, useId, useState } from 'react';
import type { CreatorSlide } from '../../domain/types';
import type {
  JsonSlideDefaultDocument,
  JsonSlideDocument,
  JsonSlideImageCoverDocument,
  JsonSlideTextStackDocument,
} from '../../../presentation/jsonSlideTypes';
import type { SlideTheme } from '../../../presentation/types';
import { useEditorStore } from '../editorStore';
import { AssetPicker } from '../assets/AssetPicker';
import { Alert } from '../../ui/alert';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Textarea } from '../../ui/textarea';

interface StructuredInspectorProps {
  slide: CreatorSlide;
}

/**
 * Radix Select запрещает SelectItem value="". Используем sentinel для "пустого"
 * выбора и мапим его в "" в onValueChange/value.
 */
const NONE = '__none__';
const toUi = (value: string): string => (value === '' ? NONE : value);
const fromUi = (value: string): string => (value === NONE ? '' : value);

const THEME_OPTIONS: { value: SlideTheme | ''; label: string }[] = [
  { value: '', label: '— не задано —' },
  { value: 'editorial', label: 'editorial' },
  { value: 'signal', label: 'signal' },
  { value: 'cinema', label: 'cinema' },
];

const HEADER_ALIGN_OPTIONS = [
  { value: 'left', label: 'слева' },
  { value: 'center', label: 'по центру' },
] as const;

const DENSITY_OPTIONS = [
  { value: '', label: '— не задано —' },
  { value: 'compact', label: 'compact' },
  { value: 'comfortable', label: 'comfortable' },
  { value: 'relaxed', label: 'relaxed' },
] as const;

const CONTENT_ALIGN_OPTIONS = [
  { value: '', label: '— не задано —' },
  { value: 'left', label: 'left' },
  { value: 'center', label: 'center' },
] as const;

const TEXT_STACK_ALIGN_OPTIONS = [
  { value: 'left', label: 'left' },
  { value: 'center', label: 'center' },
  { value: 'right', label: 'right' },
] as const;

const TEXT_STACK_JUSTIFY_OPTIONS = [
  { value: 'start', label: 'start' },
  { value: 'center', label: 'center' },
  { value: 'end', label: 'end' },
] as const;

const STACK_GAP_OPTIONS = [
  { value: '', label: '— по умолчанию —' },
  { value: 'xs', label: 'xs' },
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
] as const;

const IMAGE_COVER_OVERLAY_OPTIONS = [
  { value: 'none', label: 'none' },
  { value: 'gradientPinkBottom', label: 'gradientPinkBottom' },
  { value: 'gradientBg55', label: 'gradientBg55' },
  { value: 'gradientBg80', label: 'gradientBg80' },
] as const;

function getTemplate(doc: JsonSlideDocument): 'default' | 'imageCover' | 'textStack' {
  if (doc.template === 'imageCover') return 'imageCover';
  if (doc.template === 'textStack') return 'textStack';
  return 'default';
}

export function StructuredInspector({ slide }: StructuredInspectorProps) {
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

  // --- Document editing (only when validation is ok) ------------------------
  const doc = slide.validation.status === 'valid' ? slide.validation.doc : null;

  const patchDoc = useCallback(
    (mutator: (draft: JsonSlideDocument) => JsonSlideDocument) => {
      if (!doc) return;
      const next = mutator(doc);
      store.updateSlideDocument(slide.id, next);
    },
    [doc, slide.id, store],
  );

  return (
    <div className="flex flex-col gap-4 text-sm">
      <p className="rounded-md border border-neutral-800 bg-neutral-900/40 px-3 py-2 text-[11px] leading-4 text-neutral-400">
        Текст редактируется прямо на слайде. Здесь — структура, тема и медиа.
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
        <DocumentForm doc={doc} patch={patchDoc} />
      )}
    </div>
  );
}

interface DocumentFormProps {
  doc: JsonSlideDocument;
  patch: (mutator: (draft: JsonSlideDocument) => JsonSlideDocument) => void;
}

function DocumentForm({ doc, patch }: DocumentFormProps) {
  const template = getTemplate(doc);
  const theme = doc.theme ?? '';

  return (
    <>
      <Section title="Документ">
        <Field label="Тема (theme)">
          <Select
            value={toUi(theme)}
            onValueChange={(raw) => {
              const value = fromUi(raw);
              patch((draft) => {
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
                <SelectItem key={o.value} value={toUi(o.value)}>
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

      {template === 'default' ? (
        <DefaultDocumentForm doc={doc as JsonSlideDefaultDocument} patch={patch} />
      ) : null}
      {template === 'imageCover' ? (
        <ImageCoverDocumentForm doc={doc as JsonSlideImageCoverDocument} patch={patch} />
      ) : null}
      {template === 'textStack' ? (
        <TextStackDocumentForm doc={doc as JsonSlideTextStackDocument} patch={patch} />
      ) : null}
    </>
  );
}

// --- default template form ---------------------------------------------------

interface DefaultFormProps {
  doc: JsonSlideDefaultDocument;
  patch: (mutator: (draft: JsonSlideDocument) => JsonSlideDocument) => void;
}

function DefaultDocumentForm({ doc, patch }: DefaultFormProps) {
  const header = doc.header;
  const content = doc.content;
  const headerAlignId = useId();

  const patchHeader = (mutator: (h: typeof header) => typeof header) => {
    patch((draft) => {
      if ((draft as JsonSlideDefaultDocument).header === undefined) return draft;
      const d = draft as JsonSlideDefaultDocument;
      return { ...d, header: mutator(d.header) };
    });
  };

  const patchContent = (
    mutator: (c: JsonSlideDefaultDocument['content']) => JsonSlideDefaultDocument['content'],
  ) => {
    patch((draft) => {
      const d = draft as JsonSlideDefaultDocument;
      const next = mutator(d.content);
      if (next === undefined) {
        const { content: _omit, ...rest } = d;
        void _omit;
        return rest;
      }
      return { ...d, content: next };
    });
  };

  return (
    <>
      <Section title="Заголовок (header)">
        <Field label="Meta (обязательно)">
          <Input
            type="text"
            value={header.meta}
            onChange={(e) =>
              patchHeader((h) => ({ ...h, meta: e.target.value }))
            }
            size="sm"
            className="w-full"
          />
        </Field>
        <p className="text-[11px] leading-4 text-neutral-500">
          Title и Lead редактируются прямо на слайде — двойной клик по тексту.
        </p>
        <Field label="Выравнивание">
          <RadioGroup
            value={header.align ?? 'left'}
            onValueChange={(value) =>
              patchHeader((h) => ({ ...h, align: value as 'left' | 'center' }))
            }
            className="flex gap-4"
          >
            {HEADER_ALIGN_OPTIONS.map((opt) => {
              const id = `${headerAlignId}-${opt.value}`;
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
        </Field>
      </Section>

      <Section title="Контент (content)">
        <Field label="Плотность (density)">
          <Select
            value={toUi(content?.density ?? '')}
            onValueChange={(raw) => {
              const v = fromUi(raw);
              patchContent((c) => {
                const base = c ?? {};
                if (v === '') {
                  const { density: _d, ...rest } = base;
                  void _d;
                  const isEmpty = Object.keys(rest).length === 0;
                  return isEmpty ? undefined : rest;
                }
                return {
                  ...base,
                  density: v as NonNullable<typeof base.density>,
                };
              });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DENSITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={toUi(o.value)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Выравнивание контента (align)">
          <Select
            value={toUi(content?.align ?? '')}
            onValueChange={(raw) => {
              const v = fromUi(raw);
              patchContent((c) => {
                const base = c ?? {};
                if (v === '') {
                  const { align: _a, ...rest } = base;
                  void _a;
                  const isEmpty = Object.keys(rest).length === 0;
                  return isEmpty ? undefined : rest;
                }
                return {
                  ...base,
                  align: v as NonNullable<typeof base.align>,
                };
              });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_ALIGN_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={toUi(o.value)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Section>

      <Section title="Лэйаут (layout)">
        <Field label="Тип">
          <div className="text-xs text-neutral-300">
            <span className="rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 font-mono text-[11px]">
              {doc.layout.type}
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-4 text-neutral-500">
            Смена типа лэйаута ломает его внутреннюю структуру. В MVP редактируй через Raw JSON.
          </p>
        </Field>
      </Section>
    </>
  );
}

// --- imageCover template form -----------------------------------------------

interface ImageCoverFormProps {
  doc: JsonSlideImageCoverDocument;
  patch: (mutator: (draft: JsonSlideDocument) => JsonSlideDocument) => void;
}

function ImageCoverDocumentForm({ doc, patch }: ImageCoverFormProps) {
  const bg = doc.cover.background;
  const patchBackground = (mutator: (b: typeof bg) => typeof bg) => {
    patch((draft) => {
      const d = draft as JsonSlideImageCoverDocument;
      return {
        ...d,
        cover: { ...d.cover, background: mutator(d.cover.background) },
      };
    });
  };

  return (
    <Section title="Обложка (cover.background)">
      <Field label="Источник (src)">
        <AssetPicker
          value={bg.src}
          kind="image"
          placeholder="https://… или /local/path.jpg"
          onChange={(url, meta) => {
            patchBackground((b) => {
              const next = { ...b, src: url };
              if (meta?.alt && (next.alt === undefined || next.alt === '')) {
                next.alt = meta.alt;
              }
              return next;
            });
          }}
        />
      </Field>
      <Field label="Alt">
        <Input
          type="text"
          value={bg.alt ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            patchBackground((b) => {
              if (v === '') {
                const { alt: _a, ...rest } = b;
                void _a;
                return rest;
              }
              return { ...b, alt: v };
            });
          }}
          size="sm"
          className="w-full"
        />
      </Field>
      <Field label="Overlay">
        <Select
          value={bg.overlay}
          onValueChange={(value) =>
            patchBackground((b) => ({
              ...b,
              overlay: value as typeof bg.overlay,
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {IMAGE_COVER_OVERLAY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <p className="mt-1 text-[11px] leading-4 text-neutral-500">
        Заголовок и тексты рейлов правятся прямо на слайде. Здесь — фон и обводка.
      </p>
    </Section>
  );
}

// --- textStack template form -------------------------------------------------

interface TextStackFormProps {
  doc: JsonSlideTextStackDocument;
  patch: (mutator: (draft: JsonSlideDocument) => JsonSlideDocument) => void;
}

function TextStackDocumentForm({ doc, patch }: TextStackFormProps) {
  const stack = doc.stack;
  const patchStack = (mutator: (s: typeof stack) => typeof stack) => {
    patch((draft) => {
      const d = draft as JsonSlideTextStackDocument;
      return { ...d, stack: mutator(d.stack) };
    });
  };

  return (
    <>
      <Section title="Стек текста (stack)">
        <Field label="Align">
          <Select
            value={stack.align}
            onValueChange={(value) =>
              patchStack((s) => ({ ...s, align: value as typeof stack.align }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEXT_STACK_ALIGN_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Justify">
          <Select
            value={stack.justify}
            onValueChange={(value) =>
              patchStack((s) => ({ ...s, justify: value as typeof stack.justify }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEXT_STACK_JUSTIFY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Gap">
          <Select
            value={toUi(stack.gap ?? '')}
            onValueChange={(raw) => {
              const v = fromUi(raw);
              patchStack((s) => {
                if (v === '') {
                  const { gap: _g, ...rest } = s;
                  void _g;
                  return rest as typeof s;
                }
                return { ...s, gap: v as NonNullable<typeof s.gap> };
              });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STACK_GAP_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={toUi(o.value)}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Section>

      <Section title="Элементы стека (только просмотр)">
        <ol className="space-y-1.5 text-xs text-neutral-300">
          {stack.items.map((item, idx) => (
            <li
              key={idx}
              className="rounded border border-neutral-800 bg-neutral-950 px-2 py-1.5"
            >
              <div className="mb-0.5 flex items-center gap-2 text-[10px] uppercase tracking-wide text-neutral-500">
                <span>#{idx + 1}</span>
                <span>{item.type}</span>
                {item.type === 'text' ? <span>{item.variant}</span> : null}
              </div>
              <div className="font-mono text-[11px] text-neutral-200">{summarizeStackItem(item)}</div>
            </li>
          ))}
        </ol>
        <p className="mt-1 text-[11px] leading-4 text-neutral-500">
          Добавление / удаление элементов — через Raw JSON.
        </p>
      </Section>
    </>
  );
}

function summarizeStackItem(item: JsonSlideTextStackDocument['stack']['items'][number]): string {
  if (item.type === 'text') {
    if ('text' in item) return item.text;
    return item.chunks.map((c) => c.text).join('');
  }
  if (item.type === 'link') return `${item.label} → ${item.href}`;
  return `image: ${item.src}`;
}

// --- layout primitives ------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-neutral-800 bg-neutral-900/30 p-3">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-neutral-300">
      <span className="text-[11px] font-medium text-neutral-400">{label}</span>
      {children}
    </label>
  );
}
