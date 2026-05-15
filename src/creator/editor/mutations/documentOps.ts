/**
 * Document operations layer for `JsonSlideDocument`.
 *
 * Это низкоуровневая internal-зона редактора Creator: тонкие, чистые
 * (без сайд-эффектов) хелперы для иммутабельной модификации JSON-документа
 * слайда по абсолютному dot-path.
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
 * Базовое чтение/запись узлов мы по-прежнему берём из уже существующих
 * `getByPath` / `setByPath` в `collectEditablePaths.ts`. Здесь — обёртки с
 * понятной сигнатурой и инкапсуляция повторяющихся в инспекторах паттернов
 * (`patchOptionalField`, `patchScalarField`).
 *
 * На этом этапе модуль НИЧЕГО не знает про "kinds" слайда (header/card/
 * quote и т.д.) — он работает с `unknown` структурой. Семантический слой
 * над document-ops появится отдельным шагом (см.
 * `.cursor/plans/creator-semantic-mutations_e5f84304.plan.md`).
 */

import { getByPath, setByPath } from '../../inline-edit/collectEditablePaths';

/**
 * Возвращает узел документа по абсолютному dot-path.
 * Если хотя бы один сегмент пути отсутствует, возвращает `undefined`.
 *
 * Тонкая обёртка над `getByPath` из `collectEditablePaths.ts`,
 * выставленная как часть mutations-API.
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

/**
 * Частный случай {@link patchNodeByPath}: иммутабельно ставит `nextValue`
 * по абсолютному dot-path, игнорируя текущее значение.
 *
 * Делает clone-on-path и возвращает новый корень. Эквивалент
 * `patchNodeByPath(doc, path, () => nextValue)`, но читается как присваивание.
 *
 * @example
 *   const next = replaceNodeByPath(doc, 'header.meta', 'Глава 2');
 *
 * @example
 *   const next = replaceNodeByPath(doc, 'stack.items.0', {
 *     type: 'text',
 *     text: 'новый пункт',
 *   });
 */
export function replaceNodeByPath(doc: unknown, path: string, nextValue: unknown): unknown {
  return patchNodeByPath(doc, path, () => nextValue);
}

/**
 * Возвращает новый объект, в котором поле `key` обновлено по правилу
 * "опциональное поле":
 *   - если `value === undefined` — ключ удаляется из объекта;
 *   - иначе — ключ записывается со значением `value`.
 *
 * Инкапсулирует паттерн, рассыпанный по kind-инспекторам в виде локальных
 * `setField` / `setOptional`: переключение чекбокса "указать поле" не должно
 * оставлять в JSON ключ со значением `undefined`.
 *
 * Объект `obj` НЕ мутируется. Возвращается мелкая копия (`{ ...obj }`) с
 * применённой правкой.
 *
 * @example
 *   // снять опциональный subtitle:
 *   patchOptionalField(card, 'subtitle', undefined)
 *   // → { ...card } без ключа `subtitle`
 *
 * @example
 *   // выставить опциональный subtitle:
 *   patchOptionalField(card, 'subtitle', { text: 'Подзаголовок' })
 *   // → { ...card, subtitle: { text: 'Подзаголовок' } }
 */
export function patchOptionalField<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K] | undefined,
): T {
  const next = { ...obj } as T;
  if (value === undefined) {
    delete (next as Record<string, unknown>)[key as string];
  } else {
    next[key] = value;
  }
  return next;
}

/**
 * То же, что {@link patchOptionalField}, но НЕ удаляет ключ при `undefined`:
 * предназначен для обязательных полей объекта (например, `header.meta` в
 * структурах, где это поле обязано присутствовать).
 *
 * Если `value === undefined`, ключу будет присвоено `undefined`, а сам ключ
 * останется в объекте — это и есть отличие от опциональной семантики.
 *
 * Объект `obj` НЕ мутируется. Возвращается мелкая копия (`{ ...obj }`) с
 * применённой правкой.
 *
 * @example
 *   // обновить обязательный title:
 *   patchScalarField(header, 'title', 'Новый заголовок')
 *   // → { ...header, title: 'Новый заголовок' }
 */
export function patchScalarField<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K],
): T {
  const next = { ...obj } as T;
  next[key] = value;
  return next;
}
