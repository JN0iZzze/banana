/**
 * Hook helpers for wiring inline-edit props onto a `<Text>` (or compatible) node.
 *
 * `useEditableBinding(path)` resolves a single dot-notation path against the
 * live editable-binding registry produced by `findEditableBinding(document, path)`.
 * If editing is off, the context is missing, the binding is absent/disabled, or
 * the binding is not a plain-text target, it returns `null`. Otherwise it
 * returns the canonical bag of props that the renderer used to assemble by hand.
 *
 * `useEditableTextProps(path)` is a spread-friendly wrapper: it returns `{}`
 * when there's nothing to edit, so consumers can write
 *   `<Text {...useEditableTextProps('header.title')}>…</Text>`
 * without conditional logic at the call site.
 *
 * `useIsEditorActive()` is a tiny convenience for code that needs to know
 * whether the editor is on at all, without resolving a specific path.
 *
 * NOTE: wave 1 only — only `binding.kind === 'plainText'` returns props;
 * structuredText / collectionField return `null` for now.
 */

import { useCallback, useMemo, type MouseEvent } from 'react';
import { useEditorMode } from './EditorModeContext';
import { findEditableBinding } from './collectEditablePaths';
import type { InspectorSelectionKind } from '../editor/inspector/selection';

export interface EditablePropsForText {
  editorPath: string;
  multiline: boolean;
  onEditorStartEdit: (path: string) => void;
  onEditorCommit: (path: string, text: string) => void;
  onEditorCancel: (path: string) => void;
}

export function useEditableBinding(path: string): EditablePropsForText | null {
  const editorMode = useEditorMode();
  if (editorMode === null) return null;
  if (editorMode.editable !== true) return null;

  const binding = findEditableBinding(editorMode.document, path);
  if (binding === null) return null;
  if (binding.enabled !== true) return null;
  if (binding.kind !== 'plainText') return null;

  return {
    editorPath: binding.path,
    multiline: binding.multiline,
    onEditorStartEdit: editorMode.onStartEdit,
    onEditorCommit: editorMode.onCommit,
    // Adapter: the context exposes `onCancel()` with no arguments, but the
    // `<Text>` editor contract passes the path. Discard the path here, exactly
    // like the inline `editorCancelAdapter` that lived in the renderers.
    // (The `path: string` parameter from the contract is intentionally absorbed
    // via TS contravariance — the arrow takes no args.)
    onEditorCancel: () => editorMode.onCancel(),
  };
}

export function useEditableTextProps(
  path: string,
): EditablePropsForText | Record<string, never> {
  const props = useEditableBinding(path);
  return props ?? {};
}

export function useIsEditorActive(): boolean {
  const editorMode = useEditorMode();
  return editorMode?.editable === true;
}

/**
 * Возвращает props для подключения click-to-select на конкретный узел JSON-документа.
 *
 * Поведение:
 * - вне editor-mode (контекст null или selection не проброшен) — возвращает `{}`,
 *   чтобы презентационный режим оставался без кликов.
 * - одиночный клик: `event.stopPropagation()` + `selection.set(path, kind)`.
 *   Двойной клик НЕ ловится этим обработчиком и оставляет inline-edit нетронутым
 *   (Convention: single click → select, double click → edit).
 * - возвращает `data-inspector-path` / `data-inspector-selected` для DOM-инспекции
 *   и тонкий outline-класс через Tailwind, если узел сейчас выделен.
 */
export interface InspectorSelectableProps {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  'data-inspector-path'?: string;
  'data-inspector-kind'?: InspectorSelectionKind;
  'data-inspector-selected'?: 'true';
  className?: string;
}

export function useInspectorSelectable(
  path: string | undefined,
  kind: InspectorSelectionKind,
): InspectorSelectableProps {
  const editorMode = useEditorMode();
  const selection = editorMode?.selection;
  const isSelected =
    selection?.current.scope === 'node' &&
    selection.current.path === path &&
    selection.current.kind === kind;

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!selection || path == null) return;
      // Не перехватываем клики на contentEditable-узлах: они должны попадать
      // в inline-edit (focus → handleFocus в Text.tsx). Если кликнули по такому
      // узлу — ничего не делаем здесь, чтобы edit-сессия не сбивалась.
      const target = event.target as HTMLElement | null;
      if (target && target.closest('[contenteditable="true"]') !== null) {
        return;
      }
      event.stopPropagation();
      selection.set(path, kind);
    },
    [selection, path, kind],
  );

  return useMemo(() => {
    if (!selection || path == null) return {};
    // ВАЖНО: не включаем поле `className` в возвращаемый объект, если узел не
    // выбран. Иначе spread `<div className="..." {...selectable}>` перетрёт
    // оригинальный className на `undefined` и сломает layout. Когда узел
    // выбран — call-site должен мержить className явно через
    // `cn(base, selectable.className)`, иначе оригинальный layout-class
    // перетрётся outline-классом.
    const props: InspectorSelectableProps = {
      onClick: handleClick,
      'data-inspector-path': path,
      'data-inspector-kind': kind,
    };
    if (isSelected) {
      props['data-inspector-selected'] = 'true';
      props.className = 'outline outline-2 outline-offset-2 outline-sky-400/70 rounded-sm';
    }
    return props;
  }, [selection, path, kind, isSelected, handleClick]);
}
