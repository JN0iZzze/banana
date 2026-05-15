# Creator Structural Inventory

## Назначение

Это прикладное приложение к [creator-structural-taxonomy.md](creator-structural-taxonomy.md).

Если taxonomy отвечает на вопрос “по каким правилам мы классифицируем сущности”, то этот документ отвечает на вопрос:

- какие именно сущности у нас есть сейчас;
- что из них мы считаем layout;
- что считаем organism;
- что считаем molecule;
- что считаем atom;
- что является только технической обёрткой.

Основные источники правды:

- `src/presentation/jsonSlideTypes.ts`
- `src/presentation/json-renderer/README.md`
- `src/creator/editor/inspector/selection.ts`

## 1. Top-level сущности

| Сущность | Где живёт | Категория | Почему |
|---|---|---|---|
| `JsonSlideDocument` | корень документа | `document` | Корневой контейнер всего слайда |
| `template: "default"` | top-level | `template` | Сценарий документа с `header + layout` |
| `template: "textStack"` | top-level | `template` | Сценарий документа с корневым `stack` |
| `template: "imageCover"` | top-level | `template` | Отдельный сценарий full-bleed cover |

## 2. Что мы считаем layout-ами

Правило: layout — это объект, который управляет размещением дочерних областей.

### Канонические layout-и (`JsonSlideLayout`)

| Сущность | Тип | Категория | Notes |
|---|---|---|---|
| `asymmetricColumns` | `JsonSlideAsymmetricLayout` | `layout` | Колонки разной ширины |
| `equalColumns` | `JsonSlideEqualLayout` | `layout` | Колонки равного веса |
| `bentoGrid` | `JsonSlideBentoLayout` | `layout` | Явная сетка по координатам |
| `uniformGrid` | `JsonSlideUniformGridLayout` | `layout` | Повторяемая сетка карточек |
| `splitLayout` | `JsonSlideSplitLayout` | `layout` | Две боковые области |
| `stackLayout` | `JsonSlideStackLayout` | `layout` | Вертикальный стек regions |
| `mediaGallery` | `JsonSlideMediaGalleryLayout` | `layout` | Геометрия размещения image/video items |

### Layout-adjacent, но не layout

| Сущность | Категория | Почему не layout |
|---|---|---|
| `template: "textStack"` | `template` | Определяет форму документа целиком, а не layout subtree |
| `stack` в `textStack` template | `organism` | Это content block слайда, а не layout dispatcher |
| `cover` в `imageCover` template | `template content root` | Это особый template-root, не `JsonSlideLayout` |
| `region` | `wrapper` | Транспортный конверт для вложенного объекта |

## 3. Что мы считаем organism-ами

Правило: organism — самостоятельный смысловой блок, который можно выбирать, настраивать и потенциально трансформировать.

### Основные organism-ы

| Сущность | Тип | Категория | Notes |
|---|---|---|---|
| `header` | `JsonSlideHeader` | `organism` | Header-блок `default` template |
| `card` | `JsonSlideCard` | `organism` | Основной content block внутри layouts |
| `quote` | `JsonSlideQuote` | `organism` | Отдельный смысловой quote/prompt блок |
| `text` region payload | `JsonSlideTextRegionPayload` | `organism` | Plain text block без card chrome |
| `stack` | `JsonSlideTextStack` | `organism` | Главный content block для `textStack` template |
| `mediaGallery` | `JsonSlideMediaGalleryLayout` | `organism-layout hybrid` | Для UX это отдельный блок слайда, хотя по контракту это layout |
| `mediaItem` | `JsonSlideMediaGalleryItem` | `organism` | Самостоятельный item внутри gallery |
| `imageCover.headline` | `JsonImageCoverHeadline` | `organism` | Главный смысловой блок cover |
| `imageCover` rail item | `JsonImageCoverRailItem` | `organism-lite` | Выделяемый блок rail-содержимого |

### Спорные случаи

| Сущность | Предлагаемая категория | Почему |
|---|---|---|
| `layout` | `layout`, не `organism` | Selectable, но отвечает за геометрию, а не за смысловой content block |
| `imageCover.background` | `structural support block` | Selectable для UX, но не смысловой organism |
| `cover` целиком | `template root`, не `organism` | Слишком верхний уровень; ближе к document-level branch |

## 4. Что мы считаем molecule-ами

Правило: molecule — внутренняя структурная часть organism-а, которая может жить в коллекции, менять порядок и состав, но не является самостоятельным top-level блоком композиции.

### Card molecules

| Сущность | Тип | Родитель | Категория |
|---|---|---|---|
| `subtitle` | `JsonSlideCardSubtitle` | `card` | `molecule` |
| `items[]` text row | `JsonSlideCardItemText` | `card` | `molecule` |
| `items[]` component row | `tagList / indexedList / featureList` item | `card` | `molecule` |
| `slot` | `JsonSlideCardSlot` | `card` | `molecule` |
| `slot.items[]` | `JsonSlideCardItem[]` | `slot` | `molecule` |
| `headerBadge` | `JsonSlideCardHeaderBadge` | `card` | `molecule` |

### Text stack molecules

| Сущность | Тип | Родитель | Категория |
|---|---|---|---|
| `stack.items[]` | `JsonSlideTextStackItem` | `stack` | `molecule` |
| `textStack` chunk | `JsonSlideTextStackTextChunk` | `stack.items[]` text item | `molecule` |

### Quote molecules

| Сущность | Тип | Родитель | Категория |
|---|---|---|---|
| `paragraphs[]` entry | `string` paragraph unit | `quote` | `molecule` |

### Text region molecules

| Сущность | Тип | Родитель | Категория |
|---|---|---|---|
| `items[]` | `JsonSlideCardItemText[]` | `textRegion` | `molecule` |

### Image cover molecules

| Сущность | Тип | Родитель | Категория |
|---|---|---|---|
| `headline.blocks[]` | `JsonImageCoverHeadlineBlock` | `imageCover.headline` | `molecule` |
| `rail text lines[]` | `string[]` | `imageCoverRail` text item | `molecule` |
| `rail cluster items[]` | `{ lines[] }[]` | `imageCoverRail` cluster item | `molecule` |
| `rail cluster item lines[]` | `string[]` | rail cluster sub-item | `molecule` |

### Media gallery molecules

| Сущность | Тип | Родитель | Категория |
|---|---|---|---|
| `mediaGallery.items[]` | `JsonSlideMediaGalleryItem[]` | `mediaGallery` | `molecule` |

## 5. Что мы считаем atom-ами

Правило: atom — минимальная редактируемая leaf-сущность без собственной meaningful внутренней структуры.

### Текстовые atom-ы

| Поле | Где живёт | Категория |
|---|---|---|
| `header.meta` | `header` | `atom` |
| `header.title` | `header` | `atom` |
| `header.lead` | `header` | `atom` |
| `card item.text` | `card.items[]` | `atom` |
| `subtitle.text` | `card.subtitle` | `atom` |
| `quote.label` | `quote` | `atom` |
| `quote.subtitle` | `quote` | `atom` |
| `quote.text` | `quote` | `atom` |
| `paragraph string` | `quote.paragraphs[]` | `atom`, но редактируется как часть molecule-коллекции |
| `textRegion item.text` | `textRegion.items[]` | `atom` |
| `stack item.text` | `stack.items[]` | `atom` |
| `chunk.text` | `textStack chunk` | `atom` |
| `headline block.text` | `headline.blocks[]` | `atom` |
| `rail line` | `rail.lines[]` | `atom` |
| `media item.caption` | `mediaItem` | `atom` |
| `mediaItem.alt` | image item | `atom` |

### Structural / stylistic atom-ы

| Поле | Примеры |
|---|---|
| enum | `align`, `justify`, `tone`, `padding`, `surface`, `gap`, `variant`, `overlay`, `objectFit` |
| boolean | `showCaption`, `frame`, `muted`, `loop`, `playsInline`, `italic`, `borderFrame`, `dimmed` |
| number | `columns`, `rows`, `span`, `leftSpan`, `rightSpan`, `offsetYPx`, `width`, `height`, `index` |
| reference | `src`, `href`, `icon`, `leadingIcon`, `watermarkIcon` |

## 6. Что является только технической обёрткой

Это важно специально проговорить, чтобы не строить editor UX вокруг внутренних routing-shape сущностей.

| Сущность | Статус |
|---|---|
| `region` | wrapper |
| `kind` discriminator | routing field |
| `type` discriminator у layout/item | routing field |
| dot-path (`layout.items.0.region.card...`) | internal addressing |

Ни одна из этих сущностей не должна становиться пользовательским понятием в UI.

## 7. Прикладной вывод для Creator

### Для selection

Selection model должна в первую очередь оперировать:

- `slide`
- `layout`
- `header`
- `card`
- `quote`
- `textRegion`
- `stack`
- `mediaGallery`
- `mediaItem`
- `imageCoverHeadline`
- `imageCoverRail`
- `imageCoverBackground` как special-case support block

### Для inspector

- `layout` инспектируем как геометрию;
- `organism` инспектируем как смысловой блок;
- `molecule` показываем в структурных секциях внутри organism inspector-а;
- `atom` редактируем как обычное поле.

### Для structural actions

Первая волна structural actions должна идти по molecules:

- `stack.items[]`
- `quote.paragraphs[]`
- `headline.blocks[]`
- `rail.lines[]`
- `card.items[]`
- `card.slots[]`

Потому что это изменяет состав organism-а, не ломая глобальную композицию документа.

## 8. Short version

Если совсем коротко:

- `template` — сценарий документа
- `layout` — геометрия
- `organism` — самостоятельный блок
- `molecule` — внутренняя часть блока
- `atom` — leaf value
- `region` — не сущность UX, а технический wrapper

Это и есть базовый словарь, на который дальше должны опираться:

- selection kinds
- inspector scopes
- semantic mutations
- replace/transform
- structural editing
