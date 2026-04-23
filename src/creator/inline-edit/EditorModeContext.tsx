import { createContext, useContext } from 'react';

export type EditorModeContextValue = {
  editable: boolean;
  editingPath: string | null;
  onStartEdit: (path: string) => void;
  onCommit: (path: string, text: string) => void;
  onCancel: () => void;
};

export const EditorModeContext = createContext<EditorModeContextValue | null>(null);

/**
 * Returns the EditorModeContext value, or null if the context provider is absent.
 *
 * Intentionally does NOT throw when the context is missing — the JSON renderer
 * runs in presentation mode without any editor context, so returning null is
 * the correct behaviour.
 */
export function useEditorMode(): EditorModeContextValue | null {
  return useContext(EditorModeContext);
}
