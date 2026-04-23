# Creator Inline Text Editing PoC Plan

## Цель

Доказать, что инлайн-редактирование plain-text контента прямо на превью слайда реализуемо и полезно.

Не «полноценный редактор как в Figma». Минимальная вертикаль: кликнул по тексту — отредактировал — сохранилось.

## Что считаем успехом PoC

1. Открыл слайд в `Creator`.
2. Кликнул по тексту прямо на превью.
3. Отредактировал inline.
4. Commit — превью сразу обновилось.
5. После перезагрузки — тот же текст из БД.

## Строгий scope PoC

Поддерживаем только plain-text поля:

- `header.title`
- `header.lead`
- `header.meta`
- `textStack.items[]` с `type: "text"`
- card items с текстом

## Что сознательно НЕ делаем

- rich text, форматирование
- смену layout, template, структуры документа
- add/remove/reorder строк
- multi-selection, text toolbar, drag handles
- редактирование нескольких узлов одновременно
- caret-perfect Figma-like поведение

## Подход: contentEditable на реальных текстовых элементах

Текстовый DOM-элемент (`h1`, `p`, `pre`) в рендерере сам становится редактируемым. Никакого overlay, никакого позиционирования.

```
пользователь кликает по тексту
→ элемент уже contentEditable (в creator mode)
→ onBlur → commit text → updateSlideDocument
```

### Почему contentEditable, а не overlay и не замена на input

**Overlay**: editor живёт в координатной системе viewport, текст — в scaled container (transform: scale). Стабильно синхронизировать невозможно.

**Input вместо текста**: нужно матчить стили box-model браузера с typographic стилями слайда. Каждый вариант (`h1`, `lead`, `body`, `prompt`) — отдельный кейс. Добавляет знание об editor state внутрь рендерера.

**contentEditable**: browser сам масштабирует события внутри scaled container. Стили не нужно матчить — это и есть отрендеренный текст. Caret работает нативно.

### Про Framer Motion (Reveal)

Все текстовые узлы обёрнуты в `motion.div` (Reveal). Анимация файрится один раз при маунте. React при коммите обновит только children внутри `motion.div` — сам узел не перемонтируется, анимация не перезапустится. Риска нет.

## Архитектура

### 1. EditorModeContext

```ts
type EditorModeContext = {
  editable: boolean;
  editingPath: string | null;
  onStartEdit: (path: string) => void;
  onCommit: (path: string, text: string) => void;
  onCancel: () => void;
};
```

Провайдер живёт в `SlidePreview`. В presentation runtime контекст не существует — поведение рендерера не меняется.

### 2. Editable text nodes

Каждый текстовый элемент, который поддерживаем в PoC, получает `data-editor-path` — детерминированный путь к полю в документе:

```
header.title
header.lead
header.meta
textStack.items.0.text
content.columns.0.cards.0.items.1.text
```

В creator mode (контекст активен) элемент получает:

```tsx
<h1
  data-editor-path="header.title"
  contentEditable
  suppressContentEditableWarning
  onFocus={() => onStartEdit('header.title')}
  onBlur={e => onCommit('header.title', e.currentTarget.textContent ?? '')}
  onKeyDown={handleKeys}
>
  {title}
</h1>
```

В presentation mode — просто `<h1>{title}</h1>`.

### 3. handleKeys

- `Escape` — cancel (restore original text через ref, blur)
- `Enter` для однострочных полей (title, meta) — commit (blur)
- `Cmd/Ctrl+Enter` для многострочных — commit (blur)

### 4. Commit → document

```
onCommit(path, nextText)
→ set(cloneDeep(doc), path, nextText)
→ store.updateSlideDocument(slideId, nextDoc)
→ editingPath = null
```

`set` из lodash по пути строки. Документ не мутируется.

## Технические этапы

### Этап 1. collectEditablePaths(doc)

Helper, который из `JsonSlideDocument` возвращает список путей к редактируемым text-полям.

```ts
type EditablePath = {
  path: string;       // 'header.title', 'textStack.items.0.text', ...
  multiline: boolean; // влияет на Enter behaviour
};

function collectEditablePaths(doc: JsonSlideDocument): EditablePath[]
```

Покрываем в первой волне: `header.title`, `header.lead`, `textStack.items[].text`.

### Этап 2. EditorModeContext + SlidePreview wiring

- Создать контекст.
- В `SlidePreview` обернуть `<SlideComponent>` в provider.
- Хранить `editingPath` и `originalText` (ref для cancel).

### Этап 3. Модификация Text компонента

`Text` читает `EditorModeContext`. Если контекст активен и путь входит в поддержанные — добавляет `contentEditable`, `data-editor-path`, обработчики.

Обычный presentation render не меняется: контекст не существует → ветка не активируется.

### Этап 4. Commit → store

По blur/Enter вызвать `updateSlideDocument` с обновлённым документом. Закрыть editor (editingPath = null).

### Этап 5. Survival checks

- Смена выбранного слайда во время редактирования → cancel.
- Escape → restore.
- Resize preview → никакого пересчёта не нужно (contentEditable нативный).

## Волны покрытия

### Волна A (PoC)

- `header.title`
- `header.lead`
- `textStack.items[].text`

### Волна B (после подтверждения гипотезы)

- `header.meta`
- card text items

### Волна C (не часть PoC)

- остальные text-bearing zones контракта

## Ограничения PoC, которые допустимы

- только plain string, без форматирования;
- один активный редактор за раз;
- не сохранять selection/caret между rerenderами;
- не покрывать все text nodes DSL.

## Критерии готовности PoC

- для `header.title`, `header.lead`, `textStack.items[].text` есть inline edit;
- клик открывает редактор прямо на тексте;
- commit меняет `json_document` и обновляет превью;
- после reload изменения остаются;
- UX не ощущается как «textarea поверх скриншота».

## Самый короткий practical вывод

Одна вертикаль:

**collectEditablePaths → EditorModeContext → contentEditable на Text → commit → updateSlideDocument**

Никакого overlay. Никакого позиционирования. Scale не важен.
