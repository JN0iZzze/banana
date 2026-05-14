/**
 * Реестр инспекторов узлов: `InspectorSelectionKind` → React-компонент.
 *
 * Подключается к `NodeInspector` (Этап 4 рефакторинга): по `selection.kind`
 * вытаскиваем готовый компонент и рендерим его с пропсами `NodeInspectorProps`.
 *
 * Здесь — только map + lookup. Никаких бизнес-правил, ни обработки patch'ей,
 * ни template-routing. Конкретные kind-инспекторы (`HeaderInspector`,
 * `CardInspector` и т.д.) регистрируются в `registry.defaults.ts` (Этап 5
 * наполнит этот файл реальными компонентами).
 */
import type React from 'react';
import type { JsonSlideDocument } from '../../../presentation/jsonSlideTypes';
import type { InspectorSelection, InspectorSelectionKind } from './selection';

/**
 * Пропсы, которые `NodeInspector` пробрасывает в kind-компонент из реестра.
 */
export interface NodeInspectorProps {
  /** Текущий node-selection: гарантированно `scope === 'node'`. */
  selection: Extract<InspectorSelection, { scope: 'node' }>;
  /** Текущий валидный документ слайда. */
  doc: JsonSlideDocument;
  /**
   * Берёт node по path, применяет mutator, иммутабельно ставит обратно,
   * пушит обновлённый документ в стор.
   *
   * @param path — абсолютный dot-path от корня `JsonSlideDocument`
   *               (формат `EditableBinding.path`).
   * @param mutator — получает текущий узел (или `undefined`), возвращает новый.
   */
  patchNode: (path: string, mutator: (node: unknown) => unknown) => void;
  /**
   * Полный document-level patch на случай structural изменений (используется
   * редко — например, когда правка затрагивает несколько узлов сразу или
   * корневые поля документа).
   */
  patchDoc: (mutator: (draft: JsonSlideDocument) => JsonSlideDocument) => void;
}

/** React-компонент, рендерящий инспектор для конкретного `kind`. */
export type NodeInspectorComponent = React.ComponentType<NodeInspectorProps>;

/**
 * Минимальный интерфейс реестра: lookup по `kind`. Возвращает `null`, если
 * для kind ещё не зарегистрирован компонент (это валидная ситуация — fallback
 * рисует сам `NodeInspector`).
 */
export interface InspectorRegistry {
  get(kind: InspectorSelectionKind): NodeInspectorComponent | null;
}

/**
 * Создаёт реестр из частичной мапы `kind → компонент`. Не делает ни валидации,
 * ни автозагрузки — что в map, то и доступно через `get`.
 */
export function createInspectorRegistry(
  map: Partial<Record<InspectorSelectionKind, NodeInspectorComponent>>,
): InspectorRegistry {
  return {
    get(kind) {
      return map[kind] ?? null;
    },
  };
}
