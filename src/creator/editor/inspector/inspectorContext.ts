/**
 * Ancestor inspector-context resolution.
 *
 * Selection-модель остаётся single-node (один `path + kind`), но правый
 * инспектор строит контекстную иерархию: для выбранного content-узла
 * поднимаются секции значимых родителей (в первую очередь `layout`).
 *
 * Контракт (план `contextual_layout_inspector`):
 *   - никакой fallback-магии по строковым эвристикам (`contains("layout")`);
 *   - kind определяется по реальной JSON-структуре узла, прочитанного по
 *     canonical dot-path;
 *   - корень документа сюда не попадает (slide-level — отдельный уровень).
 *
 * Источник правды по shape узлов — `src/presentation/jsonSlideTypes.ts`.
 */

import type { JsonSlideDocument } from '../../../presentation/jsonSlideTypes';
import { getAncestorPaths, getNodeByPath } from '../mutations';
import type { InspectorSelectionKind } from './selection';

/**
 * Литералы `JsonSlideLayout['type']`. Зафиксированы здесь явным списком
 * (а не через рантайм-импорт), но это ровно тот же набор, что и в
 * `JsonSlideLayout` / парсере `parseRegionLayout`. При добавлении нового
 * layout-варианта список нужно расширить здесь же.
 */
const LAYOUT_TYPES: ReadonlySet<string> = new Set([
  'asymmetricColumns',
  'equalColumns',
  'bentoGrid',
  'uniformGrid',
  'splitLayout',
  'stackLayout',
  'mediaGallery',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Узел документа, который инспектор умеет показывать как контекст. */
export interface InspectorContext {
  path: string;
  /** Пока единственный поддерживаемый context-kind — `layout`. */
  kind: Extract<InspectorSelectionKind, 'layout'>;
}

/**
 * Если узел по `path` — layout (по реальному `type`), возвращает context;
 * иначе `null`. Чистое чтение, без догадок по строке пути.
 */
export function resolveInspectorContext(
  path: string,
  doc: JsonSlideDocument,
): InspectorContext | null {
  const node = getNodeByPath(doc, path);
  if (isRecord(node) && typeof node.type === 'string' && LAYOUT_TYPES.has(node.type)) {
    return { path, kind: 'layout' };
  }
  return null;
}

/**
 * Упорядоченная цепочка релевантных предков `path` — от ближайшего layout к
 * самому внешнему. Сам `path` не включается (его рисует primary inspector).
 */
export function collectAncestorInspectorContexts(
  path: string,
  doc: JsonSlideDocument,
): InspectorContext[] {
  return getAncestorPaths(path)
    .map((p) => resolveInspectorContext(p, doc))
    .filter((c): c is InspectorContext => c !== null);
}
