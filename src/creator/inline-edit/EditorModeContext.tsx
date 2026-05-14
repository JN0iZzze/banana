import { createContext, useContext } from 'react';
import type {
  InspectorSelection,
  InspectorSelectionKind,
} from '../editor/inspector/selection';

/**
 * Selection-API инспектора, проброшенный в render-tree рядом с inline-edit.
 *
 * Это отдельная ось от `editingPath`: одинарный клик на узле даёт `set(...)`,
 * двойной клик / контент-эдит остаются ответственностью inline-edit. См.
 * `.cursor/plans/creator-inspector-refactor_42929404.plan.md` (этап 2).
 */
export interface EditorSelectionApi {
  current: InspectorSelection;
  set: (path: string, kind: InspectorSelectionKind) => void;
  clear: () => void;
}

export type EditorModeContextValue = {
  editable: boolean;
  editingPath: string | null;
  /**
   * Дерево документа в форме, совпадающей с рендером превью: для валидных
   * слайдов это `slide.validation.doc` (см. `toJsonSlideDefinition`), иначе `slide.document`.
   * Нужно для `useEditableBinding` / реестра путей.
   */
  document: unknown;
  onStartEdit: (path: string) => void;
  onCommit: (path: string, text: string) => void;
  onCancel: () => void;
  /**
   * Опциональный selection-API. Если не задан (например, JSON-рендерер
   * работает в презентационном режиме), узлы просто не вешают click-handler.
   * Не сливается с `editingPath` — это две независимые оси (selection vs edit).
   */
  selection?: EditorSelectionApi;
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
