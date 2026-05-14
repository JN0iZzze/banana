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

import { useEditorMode } from './EditorModeContext';
import { findEditableBinding } from './collectEditablePaths';

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
