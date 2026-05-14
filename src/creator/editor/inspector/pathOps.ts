/**
 * Хелперы доступа к узлам JSON-документа слайда по абсолютному dot-path.
 *
 * Path — это абсолютный путь от корня `JsonSlideDocument`, ровно того же
 * формата, что и `EditableBinding.path` (см. `src/creator/inline-edit/
 * collectEditablePaths.ts`): сегменты разделены точкой, числовые сегменты
 * адресуют элементы массивов. Примеры:
 *   - `header.title`
 *   - `stack.items.0.text`
 *   - `layout.regions.left.cards.0`
 *   - `cover.headline.blocks.2.text`
 *
 * Базовое чтение/запись узлов берём из уже существующих `getByPath`/`setByPath`
 * в `collectEditablePaths.ts` (там же лежит сборщик editable-привязок). Здесь
 * мы добавляем тонкие обёртки с понятной для инспектора сигнатурой и
 * иммутабельную мутацию через mutator-колбэк.
 */

import { getByPath, setByPath } from '../../inline-edit/collectEditablePaths';

/**
 * Возвращает узел документа по абсолютному dot-path.
 * Если хотя бы один сегмент пути отсутствует, возвращает `undefined`.
 *
 * @example getNodeByPath(doc, 'header.title')              // 'Hello'
 * @example getNodeByPath(doc, 'stack.items.2.text')        // 'Третий пункт'
 * @example getNodeByPath(doc, 'layout.regions.left.cards.0') // { ... } или undefined
 */
export function getNodeByPath(doc: unknown, path: string): unknown {
  return getByPath(doc, path);
}

/**
 * Иммутабельно применяет `mutator` к узлу по абсолютному dot-path.
 *
 * Делает clone-on-path: исходный документ НЕ мутируется, возвращается новый
 * корень, в котором заменён только узел по `path` (значение определяется
 * `mutator(currentNode)`). Если узла по пути нет, mutator получает
 * `undefined` и его результат записывается на это место.
 *
 * @example
 *   const next = patchNodeByPath(doc, 'header.title', () => 'Новый заголовок');
 *
 * @example
 *   const next = patchNodeByPath(doc, 'stack.items.0', (node) => ({
 *     ...(node as Record<string, unknown>),
 *     text: 'обновили текст',
 *   }));
 */
export function patchNodeByPath(
  doc: unknown,
  path: string,
  mutator: (node: unknown) => unknown,
): unknown {
  const current = getByPath(doc, path);
  const nextValue = mutator(current);
  return setByPath(doc, path, nextValue);
}
