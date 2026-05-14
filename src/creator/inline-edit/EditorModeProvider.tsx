import { useEffect, useRef, useState } from 'react';
import type { CreatorValidation } from '../domain/types';
import { EditorModeContext } from './EditorModeContext';
import { getByPath, setByPath } from './collectEditablePaths';

interface EditorModeProviderProps {
  slide: { id: string; document: unknown; validation: CreatorValidation };
  onUpdateDocument: (slideId: string, doc: unknown) => void;
  children: React.ReactNode;
}

/** Same tree the renderer uses (`toJsonSlideDefinition` reads `validation.doc`). */
function editingBaseDocument(slide: EditorModeProviderProps['slide']): unknown {
  return slide.validation.status === 'valid' ? slide.validation.doc : slide.document;
}

export function EditorModeProvider({ slide, onUpdateDocument, children }: EditorModeProviderProps) {
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const originalTextRef = useRef<string | null>(null);

  // Track editingPath in a ref so the slide.id effect can access the latest value
  // without it being a dependency (which would re-run the effect on every edit).
  const editingPathRef = useRef<string | null>(editingPath);
  editingPathRef.current = editingPath;

  // Cancel active edit when the slide changes.
  useEffect(() => {
    if (editingPathRef.current !== null) {
      const path = editingPathRef.current;
      const el = document.querySelector<HTMLElement>(`[data-editor-path="${path}"]`);
      if (el !== null && originalTextRef.current !== null) {
        el.textContent = originalTextRef.current;
      }
      setEditingPath(null);
      originalTextRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide.id]);

  function onStartEdit(path: string) {
    const base = editingBaseDocument(slide);
    const current = getByPath(base, path);
    originalTextRef.current = typeof current === 'string' ? current : null;
    setEditingPath(path);
  }

  function onCommit(path: string, text: string) {
    const nextDoc = setByPath(editingBaseDocument(slide), path, text);
    onUpdateDocument(slide.id, nextDoc);
    setEditingPath(null);
    originalTextRef.current = null;
  }

  function onCancel() {
    if (editingPath !== null) {
      const el = document.querySelector<HTMLElement>(`[data-editor-path="${editingPath}"]`);
      if (el !== null && originalTextRef.current !== null) {
        el.textContent = originalTextRef.current;
      }
    }
    setEditingPath(null);
    originalTextRef.current = null;
  }

  return (
    <EditorModeContext.Provider
      value={{
        editable: true,
        editingPath,
        document: editingBaseDocument(slide),
        onStartEdit,
        onCommit,
        onCancel,
      }}
    >
      {children}
    </EditorModeContext.Provider>
  );
}
