import { useCallback, useMemo } from 'react';
import type { JsonSlideDocument } from '../../../presentation/jsonSlideTypes';
import { useEditorStore } from '../editorStore';
import {
  createCardActions,
  createHeaderActions,
  createImageCoverBackgroundActions,
  createImageCoverHeadlineActions,
  createImageCoverRailItemActions,
  createLayoutActions,
  createQuoteActions,
  createStackActions,
  createTextRegionActions,
} from '../mutations';
import { Section } from './inspectorPrimitives';
import { getNodeByPath } from './pathOps';
import { defaultInspectorRegistry } from './registry.defaults';
import type {
  InspectorRegistry,
  NodeInspectorProps,
  NodeKindActions,
} from './registry';
import type { InspectorSelection } from './selection';

interface NodeInspectorEntryProps {
  selection: Extract<InspectorSelection, { scope: 'node' }>;
  /** Опционально — реестр для тестов / альтернативных подключений. */
  registry?: InspectorRegistry;
}

/**
 * Точка входа инспектора узла. Сама не знает форматов конкретных узлов: берёт
 * текущий слайд / валидный документ из стора, ищет компонент по
 * `selection.kind` в реестре и рендерит его с пропсами `NodeInspectorProps`.
 *
 * Если для kind ещё не зарегистрирован компонент — рисует fallback с краткой
 * пометкой и JSON-сниппетом узла, чтобы было видно, что именно выделено.
 */
export function NodeInspector({ selection, registry }: NodeInspectorEntryProps) {
  const store = useEditorStore();
  const { deck, selectedSlideId, updateSlideDocument } = store;

  const slide = useMemo(() => {
    if (!deck || !selectedSlideId) return null;
    return deck.slides.find((s) => s.id === selectedSlideId) ?? null;
  }, [deck, selectedSlideId]);

  const doc: JsonSlideDocument | null =
    slide && slide.validation.status === 'valid' ? slide.validation.doc : null;

  const slideId = slide?.id ?? null;

  /**
   * Единая точка коммита для action factories: получает уже клонированный
   * с правкой документ и пушит его в стор. Используется при сборке kind-
   * specific actions ниже — фабрики из `../mutations/nodeActions` работают
   * только через этот callback и не знают про стор напрямую.
   */
  const commit = useCallback(
    (next: JsonSlideDocument) => {
      if (!slideId) return;
      updateSlideDocument(slideId, next);
    },
    [slideId, updateSlideDocument],
  );

  if (!slide) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-3 text-xs text-neutral-500">
        Слайд не выбран.
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900/30 px-3 py-3 text-xs text-neutral-500">
        Документ невалиден. Открой JSON.
      </div>
    );
  }

  const activeRegistry = registry ?? defaultInspectorRegistry;
  const Component = activeRegistry.get(selection.kind);

  if (Component) {
    const actions = buildNodeKindActions(selection, doc, commit);
    const props: NodeInspectorProps = {
      selection,
      doc,
      actions,
    };
    return <Component {...props} />;
  }

  return <NodeInspectorFallback selection={selection} doc={doc} />;
}

/**
 * Собирает kind-specific `NodeKindActions` для текущего `selection.kind`.
 *
 * Тег возвращаемого union'а гарантированно совпадает с `selection.kind`:
 * registry-компонент делает narrow по `actions.kind` и обращается к нужному
 * вложенному фасаду. Для `mediaGallery` / `mediaItem` фабрик пока нет —
 * этим kind'ам action API не зарегистрирован (и сами компоненты тоже:
 * туда уезжает `NodeInspectorFallback` через `if (Component)` выше).
 */
function buildNodeKindActions(
  selection: Extract<InspectorSelection, { scope: 'node' }>,
  doc: JsonSlideDocument,
  commit: (next: JsonSlideDocument) => void,
): NodeKindActions {
  const ctx = { path: selection.path, doc, commit };
  switch (selection.kind) {
    case 'header':
      return { kind: 'header', header: createHeaderActions(ctx) };
    case 'card':
      return { kind: 'card', card: createCardActions(ctx) };
    case 'quote':
      return { kind: 'quote', quote: createQuoteActions(ctx) };
    case 'textRegion':
      return { kind: 'textRegion', textRegion: createTextRegionActions(ctx) };
    case 'layout':
      return { kind: 'layout', layout: createLayoutActions(ctx) };
    case 'stack':
      return { kind: 'stack', stack: createStackActions(ctx) };
    case 'imageCoverBackground':
      return {
        kind: 'imageCoverBackground',
        imageCoverBackground: createImageCoverBackgroundActions(ctx),
      };
    case 'imageCoverHeadline':
      return {
        kind: 'imageCoverHeadline',
        imageCoverHeadline: createImageCoverHeadlineActions(ctx),
      };
    case 'imageCoverRail':
      return {
        kind: 'imageCoverRail',
        imageCoverRail: createImageCoverRailItemActions(ctx),
      };
    case 'mediaGallery':
      return { kind: 'mediaGallery' };
    case 'mediaItem':
      return { kind: 'mediaItem' };
  }
}

interface NodeInspectorFallbackProps {
  selection: Extract<InspectorSelection, { scope: 'node' }>;
  doc: JsonSlideDocument;
}

/**
 * Заглушка для kind'ов, у которых ещё нет своего инспектора. Показывает kind,
 * path и сериализованный сниппет выделенного узла — чтобы при подключении
 * нового инспектора можно было сразу увидеть его реальный JSON.
 */
function NodeInspectorFallback({ selection, doc }: NodeInspectorFallbackProps) {
  const node = getNodeByPath(doc, selection.path);
  const snippet = useMemo(() => safeSerialize(node), [node]);

  return (
    <div className="flex flex-col gap-3 text-sm">
      <Section title="Узел">
        <div className="flex flex-col gap-1 text-xs text-neutral-300">
          <div>
            <span className="text-neutral-500">kind: </span>
            <span className="font-mono text-neutral-100">{selection.kind}</span>
          </div>
          <div>
            <span className="text-neutral-500">path: </span>
            <span className="font-mono break-all text-neutral-200">{selection.path}</span>
          </div>
        </div>
        <p className="text-[11px] leading-4 text-neutral-500">
          Инспектор для kind <span className="font-mono text-neutral-300">{selection.kind}</span>{' '}
          ещё не реализован. Ниже — сырой JSON выделенного узла.
        </p>
      </Section>
      <Section title="JSON узла">
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded border border-neutral-800 bg-neutral-950 px-2 py-2 font-mono text-[11px] leading-4 text-neutral-300">
          {snippet}
        </pre>
      </Section>
    </div>
  );
}

function safeSerialize(node: unknown): string {
  if (node === undefined) return '// узел не найден по path';
  try {
    return JSON.stringify(node, null, 2);
  } catch {
    return String(node);
  }
}
