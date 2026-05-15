---
name: creator-inspector-dedup
overview: "Сузить роль `StructuredInspector` в Creator: убрать дубли plain-text полей, уже редактируемых inline на превью, и оставить в инспекторе только meta/structure/diagnostics/recovery. План учитывает текущий binding-registry, renderer coverage и зависимость от валидности JSON-документа."
todos:
  - id: audit-inline-first-fields
    content: Сверить реестр editable-полей с реально работающим inline-edit покрытием и зафиксировать safe-to-remove список полей из инспектора
    status: pending
  - id: trim-structured-inspector
    content: Пересобрать StructuredInspector вокруг meta + structural controls без дублирующих plain-text полей
    status: pending
  - id: clarify-editor-roles
    content: Уточнить тексты и состояния inspector/raw/validation, чтобы роли сценического и правого редактора были однозначны
    status: pending
  - id: verify-invalid-recovery
    content: Проверить и сохранить честный recovery-path для невалидных документов через Raw JSON
    status: pending
isProject: false
---

# План сужения роли StructuredInspector

## Цель
Сделать UX Creator однозначным:
- контент редактируется прямо на слайде;
- инспектор отвечает за метаданные, структурные настройки, диагностику и recovery через `Raw JSON`.

## Что уже можно считать источником truth на сцене
Inline-edit уже подключён через binding layer в:
- [src/presentation/json-renderer/JsonSlideShell.tsx](src/presentation/json-renderer/JsonSlideShell.tsx)
- [src/presentation/json-renderer/JsonTextStackShell.tsx](src/presentation/json-renderer/JsonTextStackShell.tsx)
- [src/presentation/json-renderer/nodes/JsonCardNode.tsx](src/presentation/json-renderer/nodes/JsonCardNode.tsx)
- [src/presentation/json-renderer/nodes/JsonQuoteNode.tsx](src/presentation/json-renderer/nodes/JsonQuoteNode.tsx)
- [src/presentation/json-renderer/nodes/JsonTextRegionNode.tsx](src/presentation/json-renderer/nodes/JsonTextRegionNode.tsx)
- [src/presentation/json-renderer/layouts/JsonMediaGalleryLayout.tsx](src/presentation/json-renderer/layouts/JsonMediaGalleryLayout.tsx)

Реестр editable-полей живёт в [src/creator/inline-edit/collectEditablePaths.ts](src/creator/inline-edit/collectEditablePaths.ts).

## Новая роль инспектора
Оставить в `StructuredInspector` только такие зоны:
- slide meta: внутренний `slide.title`, `speakerNotes`
- document controls: `theme`, `align`, `density`, `gap`, `overlay` и другие structural knobs
- read-only summaries там, где inline/edit ещё не закрыт полностью
- recovery-path для невалидного документа через `Raw JSON`

Убрать из structured-формы поля, которые уже надёжно редактируются на сцене:
- `header.title`
- `header.lead`
- plain-text `textStack.items[].text`
- card `subtitle.text`, `items[].text`, `slots[].items[].text`
- `quote.label` / `quote.subtitle` / `quote.text`
- `text region items[].text`
- `mediaGallery.items[].caption`

## Порядок доработок
1. Зафиксировать список plain-text полей, которые считаются полностью inline-first, на базе [src/creator/inline-edit/collectEditablePaths.ts](src/creator/inline-edit/collectEditablePaths.ts).
2. Пересобрать [src/creator/editor/inspector/StructuredInspector.tsx](src/creator/editor/inspector/StructuredInspector.tsx), чтобы он больше не рендерил дублирующие текстовые input/textarea для этих полей.
3. Оставить и подчистить только structural sections:
   - meta блока слайда
   - theme/template info
   - layout/config knobs
   - image/media controls, которые не имеют законченного inline UX
4. Переписать copy в инспекторе и validation-панели так, чтобы роли были ясны: текст меняется на сцене, структура меняется справа, невалидный документ чинится в `JSON`.
5. Проверить, что сценарий при `validation.status === 'invalid'` не деградировал: structured-tab блокируется, preview показывает ошибку, `RawJsonEditor` остаётся единственной точкой восстановления.
6. После дедупликации отдельно сверить рассинхрон между registry и renderer coverage, особенно для `imageCover`, чтобы не оставлять «заявлено editable, но на сцене не редактируется».

## Граница этапа
В этот этап не включать:
- вторую волну structured editing (`paragraphs[]`, `chunks[]`, component rows, сложные коллекции)
- смену шаблона / типа layout из structured UI
- drag-and-drop, reorder и прочие authoring-фичи

## Риски
- Если удалить поля из инспектора раньше, чем inline UX действительно стабилен, пользователь потеряет рабочий путь редактирования.
- Сейчас registry уже покрывает больше, чем гарантированно доведено в UI; перед вырезанием дублей нужна точная сверка реестра с реальным renderer coverage.
- Для невалидных документов нельзя полагаться на сцену: `Raw JSON` должен остаться честным recovery-маршрутом без fallback-магии.

## Definition of Done
- В `StructuredInspector` не осталось дублирующих plain-text контролов для inline-first полей.
- Инспектор читается как панель структуры и метаданных, а не как второй текстовый редактор.
- При валидном документе основной путь редактирования контента — сцена.
- При невалидном документе восстановление по-прежнему делается через `JSON`.
- Список inline-first полей совпадает между registry и реально подключёнными renderer-узлами.