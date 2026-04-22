---
name: nano-banana-versions-migration
overview: Мигрировать `PlaceholderNanoBananaVersionsSlide` в `JsonSlideRenderer` через стандартный `equalColumns` layout и один новый registry-backed component item для строк сравнения внутри карточек. Переиспользовать текущий card contract, а расширять только component/item слой и, при необходимости, icon registry для row-icons.
todos:
  - id: design-feature-list-item
    content: Зафиксировать typed shape нового `featureList` component item и решить, какие row-icons нужно добавить в общий icon allowlist.
    status: pending
  - id: extend-card-component-contract
    content: Расширить `jsonSlideTypes.ts` и `parseCard.ts` новым `featureList` item, включая строгую валидацию rows `{ icon, label, value }`.
    status: pending
  - id: implement-feature-list-renderer
    content: Добавить `JsonCardFeatureList` в `jsonSlideCardComponentRegistry.tsx` и подключить его через registry dispatch без изменений в `JsonCardNode`.
    status: pending
  - id: migrate-nano-banana-versions
    content: Собрать `slide-nano-banana-versions.json`, зарегистрировать документ в `jsonSlideDocumentRegistry.ts` и перевести запись `nano-banana-versions` в `mainDeck.ts` на `JsonSlideRenderer`.
    status: pending
isProject: false
---

# Миграция `nano-banana-versions` в JsonRenderer

## Контекст
Это точечная миграция legacy-слайда [src/presentation/slides/PlaceholderNanoBananaVersionsSlide.tsx](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/slides/PlaceholderNanoBananaVersionsSlide.tsx) в новую JSON-архитектуру.

По структуре слайд уже почти полностью совпадает с текущим JSON runtime:
- обычный shell с `header`
- `equalColumns` на 3 колонки
- по одной карточке в каждой колонке
- у карточки короткий верхний текст (`caption`), заголовок (`h2`) и дальше повторяющийся вертикальный список строк
- средняя карточка accent, боковые standard

Главный недостающий кусок — не layout и не shell, а **новый component item для строк сравнения** внутри карточек.

## Цель
Добавить один новый registry-backed card component item для feature/comparison rows и на нём собрать JSON-версию `nano-banana-versions`.

Ключевое решение:
- **не** добавлять новый layout type
- **не** добавлять table primitive
- **не** добавлять arbitrary className support
- использовать существующий `equalColumns` + card contract
- расширять только `card.items[]` через новый `type: "component"`

## Целевая JSON-композиция
Создать новую схему, например [src/presentation/decks/main/schemas/slide-nano-banana-versions.json](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/decks/main/schemas/slide-nano-banana-versions.json), со структурой:

- `frame.padding: "compact"`
- `backdrop.variant: "mesh"`
- `content.width: "wide"`
- `content.density: "comfortable"`
- `header.meta: "Gemini Image Line · Nano Banana"`
- `header.title: "Nano Banana"`
- `header.lead: "У каждой версии свой баланс скорости, точности и возможностей"`
- `layout.type: "equalColumns"`
- 3 items по `span: 4`

Каждая колонка должна быть `region.kind: "card"`.

### Форма карточек
В каждой карточке:
- `tone`: `standard` / `accent` / `standard`
- `padding: "default"`
- `items`:
  - `{ "variant": "caption", "text": "Fast / Flash" }`
  - `{ "variant": "h2", "text": "Nano Banana" }`
  - `{ "type": "component", "component": "featureList", ... }`

Именно список feature-rows должен забрать на себя текущую `<ul>`-часть legacy-слайда.

## Новый component item
Добавить новый id, например `featureList`.

Рекомендуемая shape:

```json
{
  "type": "component",
  "component": "featureList",
  "gap": "sm",
  "items": [
    { "icon": "zap", "label": "Философия", "value": "Быстрая" },
    { "icon": "monitor", "label": "Разрешение", "value": "1K" },
    { "icon": "image", "label": "Кол-во референсов", "value": "4 шт" }
  ]
}
```

Почему этот shape удачный:
- не привязан к одному конкретному слайду
- семантически описывает rows сравнения/характеристик
- переиспользует card tone
- хорошо ложится в текущую registry-модель рядом с `tagList` и `indexedList`

### Поведение renderer
`featureList` должен рендерить для каждой строки:
- небольшой icon badge слева
- `label` как subdued/supporting text
- `value` как основное значение строки
- нижний divider между строками, кроме последней
- стили, зависящие от `card.tone`

Это почти прямое перенесение legacy markup из [src/presentation/slides/PlaceholderNanoBananaVersionsSlide.tsx](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/slides/PlaceholderNanoBananaVersionsSlide.tsx), но инкапсулированное в registry-backed компонент.

## Icon strategy
Новый component item почти наверняка потребует row-level icons.

В legacy используются:
- `Zap`
- `Monitor`
- `Image`
- `Type`
- `Globe`
- `Brain`

В текущем registry уже есть только часть эквивалентов (`image`, `type`). Поэтому план такой:

### Базовый путь
Переиспользовать **существующий общий icon registry**, а не создавать второй отдельный registry для feature rows.

Для этого:
- расширить `JSON_SLIDE_CARD_ICON_IDS` в [src/presentation/jsonSlideTypes.ts](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/jsonSlideTypes.ts)
- расширить [src/presentation/json-renderer/jsonSlideCardIconRegistry.tsx](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/json-renderer/jsonSlideCardIconRegistry.tsx)
- добавить недостающие ids вроде `zap`, `monitor`, `globe`, `brain`

Плюс такого решения:
- один источник правды для card-related icons
- `featureList` получает тот же typed allowlist, что и карточки
- меньше параллельных контрактов

## Изменения по файлам

### 1. Типы
Обновить [src/presentation/jsonSlideTypes.ts](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/jsonSlideTypes.ts):
- добавить `featureList` в `JSON_SLIDE_CARD_COMPONENT_IDS`
- расширить `JsonSlideCardComponentId`
- добавить typed branch для нового item-а, например `JsonSlideCardItemFeatureList`
- описать `items: { icon, label, value }[]`
- при необходимости расширить `JSON_SLIDE_CARD_ICON_IDS` новыми row-icon ids

### 2. Parser
Обновить [src/presentation/json-slide-parser/parseCard.ts](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/json-slide-parser/parseCard.ts):
- добавить parser branch для `component: "featureList"`
- валидировать `gap?`
- валидировать непустой массив `items`
- валидировать каждую строку: `icon`, `label`, `value`
- использовать существующий icon allowlist, а не свободные строки

### 3. Registry renderer
Обновить [src/presentation/json-renderer/jsonSlideCardComponentRegistry.tsx](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/json-renderer/jsonSlideCardComponentRegistry.tsx):
- реализовать `JsonCardFeatureList`
- добавить его в `JSON_SLIDE_CARD_COMPONENT_REGISTRY`
- добавить `case 'featureList'` в `renderJsonCardComponentItem()`

Важно следовать уже существующей архитектуре registry и не добавлять branches в [src/presentation/json-renderer/nodes/JsonCardNode.tsx](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/json-renderer/nodes/JsonCardNode.tsx).

### 4. Icon registry
Если используете row-level icons через общий allowlist, обновить:
- [src/presentation/jsonSlideTypes.ts](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/jsonSlideTypes.ts)
- [src/presentation/json-renderer/jsonSlideCardIconRegistry.tsx](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/json-renderer/jsonSlideCardIconRegistry.tsx)

### 5. Документация
Обновить [src/presentation/json-renderer/README.md](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/json-renderer/README.md):
- добавить секцию про `featureList`
- описать shape item-а и правила валидации
- дать короткий JSON-пример
- при расширении icon ids — не забыть, что README ссылается на allowlist card icons как на closed set

### 6. Schema и регистрация
Создать новую schema [src/presentation/decks/main/schemas/slide-nano-banana-versions.json](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/decks/main/schemas/slide-nano-banana-versions.json), затем:
- зарегистрировать её в [src/presentation/jsonSlideDocumentRegistry.ts](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/jsonSlideDocumentRegistry.ts)
- добавить migrated id
- связать id с document registry

### 7. Deck wiring
Обновить [src/presentation/decks/mainDeck.ts](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/decks/mainDeck.ts):
- заменить `PlaceholderNanoBananaVersionsSlide` на `JsonSlideRenderer`
- обновить `id`, если migration path использует `MIGRATED_JSON_SLIDE_IDS`
- обновить `notes` так, чтобы было понятно: это JSON `equalColumns` slide с новым `featureList`
- удалить legacy import только после перевода записи

## Порядок реализации
1. Спроектировать final shape `featureList` item.
2. При необходимости расширить общий icon allowlist новыми ids для строк.
3. Добавить типы и parser branch.
4. Реализовать registry renderer `JsonCardFeatureList`.
5. Обновить README.
6. Собрать schema для `nano-banana-versions`.
7. Зарегистрировать её в registry и переключить deck entry.
8. Проверить визуально, что:
   - 3 колонки читаются как сопоставление версий
   - accent-card сохраняет приоритет `Pro`
   - row dividers, icon badges и типографика дают приемлемый паритет с legacy

## Что не делать в этой итерации
- не добавлять отдельный table/grid primitive ради одного слайда
- не делать второй независимый icon registry для row-items, если можно переиспользовать текущий
- не вводить свободные поля или style-пропсы в JSON item shape
- не встраивать special-case logic в `JsonCardNode`

## Критерий готовности
- `featureList` зарегистрирован как новый typed component item
- parser, registry и README синхронизированы
- row icons проходят через typed allowlist, а не через произвольные строки
- `nano-banana-versions` полностью собирается как JSON `equalColumns` slide
- deck entry переведён на `JsonSlideRenderer`
