import { useCallback, useEffect, useState } from 'react';
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

interface StructuredInspectorProps {
  slide: CreatorSlide;
}

const THEME_OPTIONS: { value: SlideTheme; label: string }[] = [
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
      <Section title="Служебное">
        <Field label="Заголовок слайда (не публикуется)">
          <input
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
            className={inputCls}
            placeholder="Для навигации в списке слайдов"
          />
        </Field>
        <Field label="Заметки для докладчика">
          <textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            onBlur={commitNotes}
            className={textareaCls}
            rows={3}
          />
        </Field>
      </Section>

      {!doc ? (
        <div className="rounded-md border border-red-900/60 bg-red-950/40 p-3 text-xs text-red-200">
          Документ невалиден, поля недоступны. Правь в Raw JSON.
        </div>
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
          <select
            value={theme}
            onChange={(e) => {
              const value = e.target.value;
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
            className={selectCls}
          >
            <option value="">— не задано —</option>
            {THEME_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
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
      <Section title="Заголовок слайда (header)">
        <Field label="Meta (обязательно)">
          <input
            type="text"
            value={header.meta}
            onChange={(e) =>
              patchHeader((h) => ({ ...h, meta: e.target.value }))
            }
            className={inputCls}
          />
        </Field>
        <Field label="Title">
          <input
            type="text"
            value={header.title ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              patchHeader((h) => {
                if (v === '') {
                  const { title: _t, ...rest } = h;
                  void _t;
                  return rest;
                }
                return { ...h, title: v };
              });
            }}
            className={inputCls}
          />
        </Field>
        <Field label="Lead">
          <textarea
            value={header.lead ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              patchHeader((h) => {
                if (v === '') {
                  const { lead: _l, ...rest } = h;
                  void _l;
                  return rest;
                }
                return { ...h, lead: v };
              });
            }}
            className={textareaCls}
            rows={3}
          />
        </Field>
        <Field label="Выравнивание">
          <div className="flex gap-3">
            {HEADER_ALIGN_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1.5 text-xs text-neutral-200">
                <input
                  type="radio"
                  name="header-align"
                  checked={(header.align ?? 'left') === opt.value}
                  onChange={() =>
                    patchHeader((h) => ({ ...h, align: opt.value }))
                  }
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Field>
      </Section>

      <Section title="Контент (content)">
        <Field label="Плотность (density)">
          <select
            value={content?.density ?? ''}
            onChange={(e) => {
              const v = e.target.value;
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
            className={selectCls}
          >
            {DENSITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Выравнивание контента (align)">
          <select
            value={content?.align ?? ''}
            onChange={(e) => {
              const v = e.target.value;
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
            className={selectCls}
          >
            {CONTENT_ALIGN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
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
        <input
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
          className={inputCls}
        />
      </Field>
      <Field label="Overlay">
        <select
          value={bg.overlay}
          onChange={(e) =>
            patchBackground((b) => ({
              ...b,
              overlay: e.target.value as typeof bg.overlay,
            }))
          }
          className={selectCls}
        >
          {IMAGE_COVER_OVERLAY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>
      <p className="mt-1 text-[11px] leading-4 text-neutral-500">
        topRail / headline / bottomRail редактируй через Raw JSON.
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
          <select
            value={stack.align}
            onChange={(e) =>
              patchStack((s) => ({ ...s, align: e.target.value as typeof stack.align }))
            }
            className={selectCls}
          >
            {TEXT_STACK_ALIGN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Justify">
          <select
            value={stack.justify}
            onChange={(e) =>
              patchStack((s) => ({ ...s, justify: e.target.value as typeof stack.justify }))
            }
            className={selectCls}
          >
            {TEXT_STACK_JUSTIFY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Gap">
          <select
            value={stack.gap ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              patchStack((s) => {
                if (v === '') {
                  const { gap: _g, ...rest } = s;
                  void _g;
                  return rest as typeof s;
                }
                return { ...s, gap: v as NonNullable<typeof s.gap> };
              });
            }}
            className={selectCls}
          >
            {STACK_GAP_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
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

const inputCls =
  'w-full rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-100 focus:border-sky-500 focus:outline-none';
const textareaCls =
  'w-full resize-y rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1.5 font-mono text-xs text-neutral-100 focus:border-sky-500 focus:outline-none';
const selectCls =
  'w-full rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1.5 text-xs text-neutral-100 focus:border-sky-500 focus:outline-none';

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
