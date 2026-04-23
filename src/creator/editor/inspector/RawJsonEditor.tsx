import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { CreatorSlide } from '../../domain/types';
import { useEditorStore } from '../editorStore';

interface RawJsonEditorProps {
  slide: CreatorSlide;
  onParseErrorChange: (error: string | null) => void;
}

function stringifyDocument(doc: unknown): string {
  try {
    return JSON.stringify(doc, null, 2);
  } catch {
    return String(doc);
  }
}

export function RawJsonEditor({ slide, onParseErrorChange }: RawJsonEditorProps) {
  const store = useEditorStore();
  const [text, setText] = useState<string>(() => stringifyDocument(slide.document));
  const [parseError, setParseError] = useState<string | null>(null);
  const lastExternalDocRef = useRef<unknown>(slide.document);

  // При переключении слайда или внешнем обновлении документа — пересинхронизируем textarea.
  useEffect(() => {
    if (slide.document !== lastExternalDocRef.current) {
      lastExternalDocRef.current = slide.document;
      setText(stringifyDocument(slide.document));
      setParseError(null);
      onParseErrorChange(null);
    }
  }, [slide.document, onParseErrorChange]);

  // Сбрасываем локальный parse error при смене слайда (по id).
  useEffect(() => {
    onParseErrorChange(parseError);
  }, [parseError, onParseErrorChange]);

  const handleChange = (next: string) => {
    setText(next);
    if (next.trim().length === 0) {
      setParseError('Пустой документ');
      return;
    }
    try {
      const parsed = JSON.parse(next);
      setParseError(null);
      lastExternalDocRef.current = parsed;
      store.updateSlideDocument(slide.id, parsed);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Неизвестная ошибка парсинга');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      void store.flushPendingDocuments();
    }
  };

  const borderCls = parseError
    ? 'border-red-700 focus:border-red-500'
    : 'border-neutral-800 focus:border-sky-500';

  return (
    <textarea
      value={text}
      onChange={(e) => handleChange(e.target.value)}
      onKeyDown={handleKeyDown}
      spellCheck={false}
      className={`h-full w-full flex-1 resize-none rounded-md border bg-neutral-950 p-3 font-mono text-xs text-neutral-100 focus:outline-none ${borderCls}`}
      style={{ whiteSpace: 'pre', overflow: 'auto' }}
    />
  );
}
