---
name: json-slide14-component-item
overview: Расширить `card.items[]` до узкого union `text | component`, зарегистрировать один разрешённый component block для `PointTags`, перевести slide 14 на JSON и задокументировать, как добавлять новые разрешённые компоненты в registry.
todos:
  - id: define-item-union
    content: Расширить `JsonSlideCard.items[]` до union text/component с allowlist для одного component id
    status: pending
  - id: parse-component-item
    content: "Обновить `parseCardItems` для валидации `type: component`, `component: tagList`, `direction`, `gap` и массива labels"
    status: pending
  - id: render-tag-list-component
    content: Добавить component registry и renderer для `tagList`, встроить его в `JsonCardNode`
    status: pending
  - id: migrate-slide-14-json
    content: Создать JSON schema для `midjourney-vs-nano-banana`, зарегистрировать документ и переключить slide на `JsonSlideRenderer`
    status: pending
  - id: document-component-registration
    content: "Обновить README: contract для component item и процесс регистрации новых разрешённых компонентов"
    status: pending
  - id: verify-backward-compat
    content: Проверить backward compatibility text-only cards и сборку/typecheck
    status: pending
isProject: false
---

# JSON Component Item For Slide 14

## Goal
Поддержать перевод `Midjourney vs Nano Banana` на JSON renderer, добавив в `card.items[]` **один registry-backed нетекстовый item kind** для `PointTags`, без перехода к произвольным React-компонентам и без превращения схемы в rich-content DSL.

## Scope
В этом шаге добавляем только:
- смешанный `items[]`: текстовые элементы + один разрешённый component item
- один зарегистрированный component id для `PointTags`
- миграцию слайда `midjourney-vs-nano-banana`
- документацию по процессу регистрации новых component items

Не делаем:
- свободные `props: Record<string, unknown>` без валидации
- общий фреймворк для любых компонентов
- больше одного зарегистрированного component id

## Proposed Contract

### 1. Make `card.items[]` a discriminated union
Вместо чисто текстового массива из [`src/presentation/jsonSlideTypes.ts`](src/presentation/jsonSlideTypes.ts) ввести union:
- `text item` — текущая форма `{ variant, text }`
- `component item` — новая форма с явным discriminator, например:
  - `type: "component"`
  - `component: "tagList"`
  - `direction?: "row" | "column"`
  - `gap?: "sm" | "md" | "lg"`
  - `items: { label: string }[]`

Рекомендация: оставить текстовые items **backward-compatible** без обязательного `type: "text"`, чтобы старые JSON продолжали проходить без миграции.

### 2. Register exactly one component item
Сделать отдельный registry по аналогии с icon registry:
- allowlist ids в [`src/presentation/jsonSlideTypes.ts`](src/presentation/jsonSlideTypes.ts)
- runtime registry file рядом с renderer-слоем, например под [`src/presentation/json-renderer/`](src/presentation/json-renderer/)
- один id: `tagList`

`tagList` должен покрывать поведение текущего `PointTags` из [`src/presentation/slides/PlaceholderMidjourneyVsNanoBananaSlide.tsx`](src/presentation/slides/PlaceholderMidjourneyVsNanoBananaSlide.tsx):
- pills из `label`
- tone берётся из card tone, а не передаётся отдельно
- `direction` и `gap` задаются в JSON item
- `wrap` можно зафиксировать включённым по умолчанию, потому что текущий `PointTags` всегда `flex-wrap`

## Parser and Validation
Обновить [`src/presentation/parseJsonSlideDocument.ts`](src/presentation/parseJsonSlideDocument.ts):
- `parseCardItems` должен различать:
  - обычный text item (текущая логика)
  - component item с `type: "component"`
- валидировать `component === "tagList"`
- валидировать `direction` как `row | column`
- валидировать `gap` через тот же словарь `sm | md | lg`
- валидировать `items` как непустой массив `{ label: string }`
- желательно отклонять дубликаты `label`, если они используются как React key, или в рендере строить key не только из label

## Renderer
Обновить [`src/presentation/json-renderer/nodes/JsonCardNode.tsx`](src/presentation/json-renderer/nodes/JsonCardNode.tsx):
- при обходе `card.items[]` ветвиться:
  - text item -> текущий `Text`
  - component item -> registry-backed renderer
- component item должен жить в том же flex-flow, что и text items, чтобы сохранялись `justify` и `stackGap`

Добавить новый renderer / registry file, например:
- [`src/presentation/json-renderer/jsonSlideCardComponentRegistry.tsx`](src/presentation/json-renderer/jsonSlideCardComponentRegistry.tsx)

Он должен:
- маппить `tagList` -> компонент pill-списка
- применять tone-aware стили по `card.tone`
- маппить `gap` token в spacing
- переключать `flex-row` / `flex-col` по `direction`

## Slide 14 Migration
Перевести [`src/presentation/slides/PlaceholderMidjourneyVsNanoBananaSlide.tsx`](src/presentation/slides/PlaceholderMidjourneyVsNanoBananaSlide.tsx) на JSON-документ:
- layout: `equalColumns` с двумя карточками `span: 6`
- card 1: `h2`, `bodyLg`, затем component item `tagList`
- card 2: то же, но `tone: accent`

Добавить новый schema JSON под [`src/presentation/decks/main/schemas/`](src/presentation/decks/main/schemas/), зарегистрировать его в [`src/presentation/jsonSlideDocumentRegistry.ts`](src/presentation/jsonSlideDocumentRegistry.ts) и переключить `midjourney-vs-nano-banana` в [`src/presentation/decks/mainDeck.ts`](src/presentation/decks/mainDeck.ts) на `JsonSlideRenderer`.

## Documentation
Обновить [`src/presentation/json-renderer/README.md`](src/presentation/json-renderer/README.md):
- описать новый union в `card.items[]`
- зафиксировать, что component items — только registry-backed allowlist
- описать shape `tagList`
- добавить отдельный раздел “How to register a new component item”:
  - добавить id в types allowlist
  - добавить parser validation
  - добавить renderer в registry
  - обновить README examples

## Verification
Проверить:
- старые text-only JSON карточки продолжают валидироваться
- slide 14 визуально повторяет текущую структуру: `h2 + bodyLg + pills`
- `direction` и `gap` работают у `tagList`
- `justify` карточки не ломается от component item
- `npm run typecheck` и `npm run build` проходят

```mermaid
flowchart LR
  cardItems[card.items[]]
  parser[parseCardItems]
  textBranch[text item]
  componentBranch[component item]
  registry[componentRegistry]
  cardNode[JsonCardNode]
  cardItems --> parser
  parser --> textBranch --> cardNode
  parser --> componentBranch --> registry --> cardNode
```
