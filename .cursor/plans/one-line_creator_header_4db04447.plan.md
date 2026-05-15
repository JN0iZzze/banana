---
name: one-line creator header
overview: Объединить глобальный и редакторский хедеры `/creator/decks/:deckId` в один однострочный бар и переразложить элементы по приоритету, чтобы сохранить читаемость и доступ к действиям.
todos:
  - id: split-shell-header
    content: Убрать отдельный global header в editor-route внутри CreatorShell
    status: completed
  - id: compose-editor-header
    content: Собрать единый однострочный header в CreatorDeckEditorPage с brand, back, title, status и actions
    status: completed
  - id: stabilize-layout
    content: Проверить truncation, высоту бара и примыкание AssetLibrary под новым header
    status: completed
isProject: false
---

# One-Line Header Plan

## Что меняем
Сейчас у editor-страницы два независимых бара:
- глобальный хедер в [src/creator/layout/CreatorShell.tsx](src/creator/layout/CreatorShell.tsx)
- локальный хедер в [src/creator/pages/CreatorDeckEditorPage.tsx](src/creator/pages/CreatorDeckEditorPage.tsx)

Из-за этого `Creator`/`К презентациям` живут в верхней строке, а `← Nova draft ... Ассеты / Просмотр` — во второй. Для однострочного решения нужно не сжимать CSS, а объединить оба уровня chrome в один header именно для editor-route.

## Предлагаемый лэйаут
Один горизонтальный бар, разбитый на 2 зоны:

- Левая зона, `min-w-0`, приоритет контента:
  - `Creator` как компактный brand-link на `/creator`
  - вертикальный divider
  - стрелка `←` назад к списку дек
  - редактируемый `deck.title` как главный элемент строки, с `truncate`
  - статус `draft|ready|archived` как chip
  - `Сохраняем…` как тихий secondary-text

- Правая зона, `shrink-0`, приоритет действий:
  - `Ассеты (N)`
  - `Просмотр`
  - `К презентациям` как secondary link/button на `/`

Визуально это выглядит так:

```mermaid
flowchart LR
  brand[Creator] --> divider1[|]
  divider1 --> back[BackArrow]
  back --> title[DeckTitleTruncate]
  title --> status[StatusChip]
  status --> saving[SavingState]
  saving --> spacer[flexSpacer]
  spacer --> assets[AssetsButton]
  assets --> preview[PreviewButton]
  preview --> presentations[PresentationsLink]
```

## Почему такой вариант
- `deck.title` остаётся главным смысловым якорем экрана.
- `Creator` не теряется, но перестаёт занимать отдельную строку.
- Все частые действия остаются справа в одной предсказуемой группе.
- Структура совпадает с текущими ролями компонентов, поэтому можно обойтись без fallback-логики и без сложной адаптивной магии.

## Технический подход
1. В [src/creator/layout/CreatorShell.tsx](src/creator/layout/CreatorShell.tsx) сделать для editor-route отдельный режим без собственного верхнего бара, чтобы shell не рисовал лишнюю строку.
2. В [src/creator/pages/CreatorDeckEditorPage.tsx](src/creator/pages/CreatorDeckEditorPage.tsx) расширить `EditorHeader`, добавив в него элементы shell-навигации (`Creator`, `К презентациям`) и переразложив содержимое по двум flex-группам.
3. Сохранить текущую механику rename/title-edit, toggle ассетов и переход в preview без изменения поведения.
4. Проставить ограничения ширины и `truncate` только на title-блок, чтобы кнопки справа не скакали.
5. Проверить, что editor grid под хедером не изменил высоту/скролл и что раскрытие `AssetLibrary` по-прежнему открывается под объединённым баром.

## Что не трогаем
- Не меняем shell для списка дек и других creator-страниц.
- Не переносим `AssetLibrary` в модалку/portal.
- Не добавляем fallback-схемы на случай "если не влезет"; базовая версия — один ряд для editor desktop-layout.

## Файлы
- [src/creator/layout/CreatorShell.tsx](src/creator/layout/CreatorShell.tsx)
- [src/creator/pages/CreatorDeckEditorPage.tsx](src/creator/pages/CreatorDeckEditorPage.tsx)
- при необходимости визуально сверить с [src/creator/editor/assets/AssetLibrary.tsx](src/creator/editor/assets/AssetLibrary.tsx), чтобы панель ассетов корректно примыкала к новому бару
