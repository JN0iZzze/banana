/**
 * Read-side хелпер доступа к узлам JSON-документа слайда по абсолютному dot-path.
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
 * Реализация переехала в internal-зону `src/creator/editor/mutations/`
 * (см. план `.cursor/plans/creator-semantic-mutations_e5f84304.plan.md`).
 * Этот модуль остаётся как тонкий compatibility-реэкспорт `getNodeByPath` —
 * read-only лукап продолжает использоваться kind-инспекторами и
 * `NodeInspectorFallback`. Write-side операции (`patchNodeByPath` и т.п.)
 * больше не экспонируются из inspector layer: мутации идут только через
 * semantic actions из `../mutations/nodeActions`.
 */

export { getNodeByPath } from '../mutations';
