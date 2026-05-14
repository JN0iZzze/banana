import type { ComponentPropsWithoutRef, ElementType, KeyboardEvent, ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { cn } from './cn';

export type SlideTextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'lead'
  | 'body'
  | 'bodyLg'
  | 'caption'
  | 'overline'
  | 'tileAccent'
  | 'meta'
  /** Monospace prompt-style block (`pre`, pre-wrap); use in cards / text regions / stacks. */
  | 'prompt';

export type SlideTextH1Size = 'display' | 'section' | 'compact';

export type SlideTextContext = 'default' | 'onAccent';

type TextOwnProps = {
  variant: SlideTextVariant;
  /** Только для variant="h1" */
  size?: SlideTextH1Size;
  context?: SlideTextContext;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** If set, the element becomes contentEditable and gets data-editor-path. */
  editorPath?: string;
  /** Multiline field: applies `white-space: pre-wrap` for display, and (when editing)
   *  Enter inserts a newline instead of committing — Cmd/Ctrl+Enter commits. */
  multiline?: boolean;
  /** Called when the user commits an edit (blur / Enter / Cmd+Enter). */
  onEditorCommit?: (path: string, text: string) => void;
  /** Called when the user cancels editing (Escape). */
  onEditorCancel?: (path: string) => void;
  /** Called when the element receives focus for editing. */
  onEditorStartEdit?: (path: string) => void;
};

export type TextProps = TextOwnProps & Omit<ComponentPropsWithoutRef<'p'>, keyof TextOwnProps | 'children'>;

const variantClass: Record<SlideTextVariant, string> = {
  h1: '',
  h2: 'slide-text-h2',
  h3: 'slide-text-h3',
  lead: 'slide-text-lead',
  body: 'slide-text-body',
  bodyLg: 'slide-text-body-lg',
  caption: 'slide-text-caption',
  overline: 'slide-text-overline',
  tileAccent: 'slide-text-tile-accent',
  meta: 'slide-text-meta',
  prompt: 'slide-text-prompt',
};

const h1SizeClass: Record<SlideTextH1Size, string> = {
  display: 'slide-text-h1-display',
  section: 'slide-text-h1-section',
  compact: 'slide-text-h1-compact',
};

function defaultElement(variant: SlideTextVariant): ElementType {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'prompt':
      return 'pre';
    case 'meta':
    case 'overline':
    case 'tileAccent':
    case 'caption':
      return 'p';
    default:
      return 'p';
  }
}

export function Text({
  variant,
  size = 'display',
  context = 'default',
  as,
  className,
  children,
  editorPath,
  multiline = false,
  onEditorCommit,
  onEditorCancel,
  onEditorStartEdit,
  ...rest
}: TextProps) {
  const Component = (as ?? defaultElement(variant)) as ElementType;
  const h1Class = variant === 'h1' ? h1SizeClass[size] : variantClass[variant];
  const baseClass = variant === 'h1' ? h1Class : variantClass[variant];

  // Keep a snapshot of the original content for cancel restore.
  const originalTextRef = useRef<string | null>(null);
  /** DOM that was focused during edit; React clears `ref` callbacks before layout cleanup, this stays until blur/unmount commit. */
  const focusedEditorElRef = useRef<HTMLElement | null>(null);
  const hostRef = useRef<HTMLElement | null>(null);
  const blurFiredRef = useRef(false);

  const editorPathLiveRef = useRef(editorPath);
  const onEditorCommitLiveRef = useRef(onEditorCommit);
  const multilineLiveRef = useRef(multiline);
  editorPathLiveRef.current = editorPath;
  onEditorCommitLiveRef.current = onEditorCommit;
  multilineLiveRef.current = multiline;

  useLayoutEffect(() => {
    return () => {
      const path = editorPathLiveRef.current;
      const commit = onEditorCommitLiveRef.current;
      if (!path || !commit) return;
      if (blurFiredRef.current) return;
      const el = focusedEditorElRef.current ?? hostRef.current;
      const orig = originalTextRef.current;
      if (!el || orig === null) {
        return;
      }
      const next = multilineLiveRef.current ? el.innerText : (el.textContent ?? '');
      if (next === orig) return;
      commit(path, next);
    };
  }, []);

  if (!editorPath) {
    return (
      <Component
        className={cn(baseClass, multiline && 'whitespace-pre-wrap', className)}
        data-slide-text-context={context === 'onAccent' ? 'onAccent' : undefined}
        {...rest}
      >
        {children}
      </Component>
    );
  }

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    blurFiredRef.current = false;
    focusedEditorElRef.current = e.currentTarget;
    originalTextRef.current = multiline
      ? e.currentTarget.innerText
      : (e.currentTarget.textContent ?? '');
    onEditorStartEdit?.(editorPath);
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    blurFiredRef.current = true;
    const nextText = multiline ? e.currentTarget.innerText : (e.currentTarget.textContent ?? '');
    onEditorCommit?.(editorPath, nextText);
    originalTextRef.current = null;
    focusedEditorElRef.current = null;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      // Restore original text before blur so commit gets the original value.
      if (originalTextRef.current !== null) {
        e.currentTarget.textContent = originalTextRef.current;
      }
      onEditorCancel?.(editorPath);
      e.currentTarget.blur();
      return;
    }

    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
      return;
    }

    if (multiline && e.key === 'Enter') {
      const el = e.currentTarget;
      e.preventDefault();
      if (e.metaKey || e.ctrlKey) {
        e.currentTarget.blur();
        return;
      }
      // execCommand('insertText', '\n') в Chrome создаёт <div>/<br>, из-за чего innerText
      // даёт лишние переводы. Вставляем один символ перевода строки через Selection API.
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) {
        return;
      }
      const range = sel.getRangeAt(0);
      if (!el.contains(range.commonAncestorContainer)) {
        return;
      }
      range.deleteContents();
      const nlNode = document.createTextNode('\n');
      range.insertNode(nlNode);
      range.setStartAfter(nlNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      el.normalize();
      return;
    }

  };

  return (
    <Component
      className={cn(
        baseClass,
        multiline && 'whitespace-pre-wrap',
        'cursor-text',
        'rounded-sm outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2 focus:ring-offset-transparent',
        className,
      )}
      data-slide-text-context={context === 'onAccent' ? 'onAccent' : undefined}
      data-editor-path={editorPath}
      contentEditable="true"
      suppressContentEditableWarning={true}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      {...rest}
      ref={(node: HTMLElement | null) => {
        hostRef.current = node;
      }}
    >
      {children}
    </Component>
  );
}
