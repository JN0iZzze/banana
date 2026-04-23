import type { JsonSlideTextStackDocument, JsonSlideTextStackItem, JsonSlideTextStackItemText } from '../jsonSlideTypes';
import { cn } from '../../ui/slides/cn';
import { Reveal, SlideBackdrop, SlideBackdropFrame, SlideContent, SlideFrame, Text } from '../../ui/slides';
import { useEditorMode, type EditorModeContextValue } from '../../creator/inline-edit/EditorModeContext';

const justifyClasses: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
};

const alignClasses: Record<string, string> = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
};

const textAlignClasses: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const gapClasses: Record<string, string> = {
  xs: 'gap-[var(--slide-grid-gap-xs)]',
  sm: 'gap-[var(--slide-grid-gap-sm)]',
  md: 'gap-[var(--slide-grid-gap-md)]',
  lg: 'gap-[var(--slide-grid-gap-lg)]',
};

const linkClassName =
  'font-mono text-3xl tracking-[0.06em] text-[color:var(--slide-color-accent)] underline decoration-white/25 underline-offset-[0.35em] transition-colors hover:text-[color:var(--slide-color-text-soft)] hover:decoration-white/50';

function renderTextStackTextContent(item: JsonSlideTextStackItemText) {
  if ('chunks' in item) {
    return item.chunks.map((chunk, c) => (
      <span
        key={c}
        className={cn(
          chunk.tone === 'accent' ? 'slide-text-stack-chunk-accent' : undefined,
          chunk.decoration === 'lineThrough' ? 'slide-text-stack-chunk-lineThrough' : undefined,
        )}
      >
        {chunk.text}
      </span>
    ));
  }
  return item.text;
}

function renderItem(
  item: JsonSlideTextStackItem,
  index: number,
  delay: number,
  preset: string,
  textAlign: string,
  editorMode: EditorModeContextValue | null,
) {
  const editorCancelAdapter = editorMode ? (_path: string) => editorMode.onCancel() : undefined;

  if (item.type === 'link') {
    return (
      <Reveal
        key={`link-${index}`}
        preset={preset as 'soft' | 'hero' | 'scale-in' | 'enter-up' | 'none'}
        delay={delay}
      >
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkClassName, textAlign)}
        >
          {item.label}
        </a>
      </Reveal>
    );
  }

  if (item.type === 'image') {
    return (
      <Reveal
        key={`image-${index}`}
        preset={preset as 'soft' | 'hero' | 'scale-in' | 'enter-up' | 'none'}
        delay={delay}
      >
        <img
          src={item.src}
          alt={item.alt ?? ''}
          className="block h-auto max-w-full object-contain"
          style={{ width: item.width, height: item.height ?? 'auto' }}
        />
      </Reveal>
    );
  }

  // Determine whether this item has a simple text field (not chunks) for inline editing.
  const hasSimpleText = 'text' in item && !('chunks' in item);

  return (
    <Reveal
      key={`text-${index}`}
      preset={preset as 'soft' | 'hero' | 'scale-in' | 'enter-up' | 'none'}
      delay={delay}
    >
      <Text
        variant={item.variant}
        size={item.variant === 'h1' ? (item.size ?? 'display') : undefined}
        context={item.context}
        className={cn(
          item.variant === 'h1' ? 'max-w-[var(--slide-content-wide)] text-pretty tracking-tight' : undefined,
          item.variant === 'prompt' ? 'max-w-full min-w-0' : undefined,
          item.variant === 'lead' ? '!max-w-full min-w-0' : undefined,
          editorMode?.editable && hasSimpleText ? 'pointer-events-auto' : undefined,
          textAlign,
        )}
        {...(editorMode?.editable && hasSimpleText ? {
          editorPath: `stack.items.${index}.text`,
          editorMultiline: true,
          onEditorStartEdit: editorMode.onStartEdit,
          onEditorCommit: editorMode.onCommit,
          onEditorCancel: editorCancelAdapter,
        } : {})}
      >
        {renderTextStackTextContent(item)}
      </Text>
    </Reveal>
  );
}

export function JsonTextStackShell({ doc }: { doc: JsonSlideTextStackDocument }) {
  const editorMode = useEditorMode();
  const frame = doc.frame ?? {};
  const backdrop = doc.backdrop ?? {};
  const content = doc.content ?? {};
  const stack = doc.stack;
  const reveal = stack.reveal;

  const backdropVariant = backdrop.variant ?? 'none';
  const backdropAlreadyHasFrame = backdropVariant === 'grid' || backdropVariant === 'mesh';
  const showShellBorderFrame = backdrop.borderFrame === true && !backdropAlreadyHasFrame;
  const showDimmedSpotlight = backdrop.dimmed === true && backdropVariant === 'spotlight';

  const preset = reveal?.preset ?? 'soft';
  const baseDelay = reveal?.baseDelay ?? 0;
  const step = reveal?.step ?? 0.08;
  const textAlign = textAlignClasses[stack.align];

  return (
    <SlideFrame align={frame.align ?? 'center'} padding={frame.padding ?? 'default'} className="relative isolate">
      <SlideBackdrop
        variant={backdropVariant}
        className={cn(showDimmedSpotlight ? 'opacity-70' : undefined)}
      />
      {showShellBorderFrame ? <SlideBackdropFrame className="z-20" /> : null}

      <SlideContent
        width={content.width ?? 'full'}
        density={content.density ?? 'relaxed'}
        align={content.align ?? 'center'}
        className={cn(
          'relative h-full min-h-0',
          justifyClasses[stack.justify],
          showShellBorderFrame ? 'z-30' : 'z-10',
        )}
      >
        <div
          className={cn(
            'flex flex-col',
            alignClasses[stack.align],
            stack.gap ? gapClasses[stack.gap] : 'gap-8',
          )}
        >
          {stack.items.map((item, i) =>
            renderItem(item, i, baseDelay + i * step, preset, textAlign, editorMode),
          )}
        </div>
      </SlideContent>
    </SlideFrame>
  );
}
