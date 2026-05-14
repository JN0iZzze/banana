import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEditorStore } from '../editorStore';
import { SlideInspector } from './SlideInspector';
import { NodeInspector } from './NodeInspector';
import { RawJsonEditor } from './RawJsonEditor';
import { ValidationPanel } from './ValidationPanel';

type InspectorTab = 'structured' | 'raw';

/**
 * Shell правой панели редактора. Здесь живут только:
 * - выбор таба (Структура / JSON);
 * - роутинг таба «Структура» по `inspectorSelection.scope`
 *   (`slide` → `SlideInspector`, `node` → `NodeInspector`);
 * - нижний блок `ValidationPanel`.
 *
 * Сама форма свойств слайда вынесена в `SlideInspector`, форма для узлов —
 * в `NodeInspector` (Этап 4 подключит к ней реестр).
 */
export function InspectorPanel() {
  const store = useEditorStore();
  const { deck, selectedSlideId, assets, inspectorSelection, clearInspectorSelection } = store;

  const slide = useMemo(() => {
    if (!deck || !selectedSlideId) return null;
    return deck.slides.find((s) => s.id === selectedSlideId) ?? null;
  }, [deck, selectedSlideId]);

  const isValid = slide?.validation.status === 'valid';

  // Локальный parse-error из Raw-режима.
  const [localParseError, setLocalParseError] = useState<string | null>(null);

  // Выбор таба. По умолчанию: «Структура», если валидно; иначе «JSON».
  const [tab, setTab] = useState<InspectorTab>(isValid ? 'structured' : 'raw');

  // При смене слайда — пересобрать таб в дефолт и сбросить parse error.
  useEffect(() => {
    setLocalParseError(null);
    setTab(slide && slide.validation.status === 'valid' ? 'structured' : 'raw');
  }, [slide?.id, slide?.validation.status, slide]);

  const handleParseErrorChange = useCallback((err: string | null) => {
    setLocalParseError(err);
  }, []);

  if (!slide) {
    return (
      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-neutral-500">
        Выбери слайд, чтобы редактировать
      </div>
    );
  }

  const structuredDisabled = !isValid;
  const isNodeScope = inspectorSelection.scope === 'node';

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex shrink-0 items-center gap-1 rounded-md border border-neutral-800 bg-neutral-950 p-1 text-xs">
        <TabButton
          active={tab === 'structured'}
          disabled={structuredDisabled}
          onClick={() => setTab('structured')}
          hint={structuredDisabled ? 'Документ невалиден' : undefined}
        >
          Структура
        </TabButton>
        <TabButton active={tab === 'raw'} onClick={() => setTab('raw')}>
          JSON
        </TabButton>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'structured' ? (
          <div className="flex flex-col gap-3">
            {isNodeScope ? (
              <button
                type="button"
                onClick={clearInspectorSelection}
                className="self-start text-[11px] text-neutral-400 transition hover:text-neutral-200"
              >
                ← Вернуться к слайду
              </button>
            ) : null}
            {inspectorSelection.scope === 'node' ? (
              <NodeInspector selection={inspectorSelection} />
            ) : (
              <SlideInspector slide={slide} />
            )}
          </div>
        ) : (
          <div className="flex h-full min-h-[240px] flex-col">
            <RawJsonEditor slide={slide} onParseErrorChange={handleParseErrorChange} />
          </div>
        )}
      </div>

      <div className="shrink-0">
        <ValidationPanel
          validation={slide.validation}
          localJsonParseError={localParseError}
          assets={assets}
        />
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  disabled?: boolean;
  hint?: string;
  onClick: () => void;
  children: React.ReactNode;
}

function TabButton({ active, disabled, hint, onClick, children }: TabButtonProps) {
  const base =
    'flex-1 rounded px-2.5 py-1 text-center transition disabled:cursor-not-allowed disabled:opacity-40';
  const cls = active
    ? 'bg-neutral-800 text-neutral-50'
    : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={hint}
      className={`${base} ${cls}`}
    >
      {children}
    </button>
  );
}
