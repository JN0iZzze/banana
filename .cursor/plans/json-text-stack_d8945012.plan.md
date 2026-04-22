---
name: json-text-stack
overview: "Доработать контракт JSON Renderer в рамках миграции legacy-слайдов: добавить первый вариант `textStack` template для минимальных текстовых слайдов и `about-me` с `link` item и per-item reveal."
todos:
  - id: define-textstack-contract
    content: Спроектировать и задокументировать новый `textStack` template и item union (`text`, `link`) в типах и README.
    status: pending
  - id: extend-parser
    content: "Расширить parser для строгой валидации `template: \"textStack\"`, `stack`, reveal-настроек и item allowlist."
    status: pending
  - id: add-textstack-renderer
    content: Добавить отдельный shell/renderer для `textStack` без `SlideHeader`, с per-item reveal и link styling по образцу legacy minimal-title.
    status: pending
  - id: register-demo-schemas
    content: Создать и зарегистрировать demo JSON-схемы для minimal-title и about-me, затем проверить их как hidden entries в deck.
    status: pending
isProject: false
---

# Реализация `textStack` для JsonRenderer

## Контекст
Задача относится не к отдельному новому шаблону сама по себе, а к двум связанным направлениям:
- миграция простых legacy-слайдов на новую JSON-архитектуру
- доработка контракта `JsonRenderer`, чтобы такие слайды вообще можно было выразить декларативно

Сейчас часть колоды уже переезжает на `JsonSlideRenderer`, но простые текстовые слайды вроде `MinimalTitleSlide`, `MinimalTitleMultiLinkSlide` и `AboutMeSlide` пока остаются legacy, потому что текущий JSON-контракт лучше покрывает shell + header + layout-слайды, а не корневой центрированный стек строк без `SlideHeader`.

Эта итерация добавляет ровно тот минимум, который нужен для безопасной миграции таких кейсов: новый `textStack` template, `text`/`link` items, per-item reveal и переиспользование типографики через `Text.tsx`.

## Цель
Сделать первую итерацию общего текстового шаблона для JSON-слайдов, который покрывает:
- минимальные титульные слайды уровня `MinimalTitleSlide`
- multi-link вариант уровня `MinimalTitleMultiLinkSlide`
- `about-me` без inline rich text-акцентов

Первая версия сознательно **не** поддерживает inline rich text внутри одной строки. Все текстовые строки рендерятся через [src/ui/slides/Text.tsx](/Users/jn0izzze/OtherAIPro/newgen/src/ui/slides/Text.tsx).

## Контракт
Добавить новый top-level template `textStack` рядом с `default` и `imageCover`.

Новый документ должен иметь:
- `template: "textStack"`
- `theme?`
- `frame?`
- `backdrop?`
- `content?`
- `stack`

`stack`:
- `align`: `left | center | right`
- `justify`: `start | center | end`
- `gap?`: `xs | sm | md | lg`
- `reveal?`: `{ preset, baseDelay?, step? }`
- `items[]`: непустой массив

`items[]` первой итерации:
- `text` item: `{ "type": "text", "variant", "text", "size?", "context?" }`
- `link` item: `{ "type": "link", "href", "label", "preset?" }`

Ограничения первой версии:
- `size` разрешить только для `variant: "h1"`
- `context` пропускать только как allowlist (`default | onAccent`)
- без `className`
- без inline spans / rich text / partial accents
- link style хардкодить в renderer по аналогии с `MinimalTitleSlide` / `MinimalTitleMultiLinkSlide`, а не выносить в JSON

## Изменения по файлам

### 1. Типы и схема
Обновить [src/presentation/jsonSlideTypes.ts](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/jsonSlideTypes.ts):
- добавить `JsonSlideTextStackDocument`
- добавить `JsonSlideTextStack`
- добавить `JsonSlideTextStackAlign`, `JsonSlideTextStackJustify`
- добавить `JsonSlideTextStackReveal`
- добавить union для `JsonSlideTextStackItem`
- расширить `JsonSlideDocument`
- обновить `isJsonSlideImageCoverDocument()` при необходимости и добавить отдельный guard для `textStack`

Обновить barrel [src/presentation/jsonSlideSchema.ts](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/jsonSlideSchema.ts), чтобы новые типы были доступны снаружи.

### 2. Parser
Расширить [src/presentation/parseJsonSlideDocument.ts](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/parseJsonSlideDocument.ts):
- распознавать `template === "textStack"`
- валидировать root shape отдельно от `default`
- переиспользовать существующий парсинг `theme`, `frame`, `backdrop`, `content`
- добавить строгий parser для `stack` и `items[]`
- запретить `header` и `layout` в `textStack`

Практически это должен быть отдельный parser-хелпер по тому же принципу, как сейчас `imageCover` вынесен в свой путь.

### 3. Renderer
Обновить [src/presentation/json-renderer/JsonSlideRenderer.tsx](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/json-renderer/JsonSlideRenderer.tsx):
- после resolve документа добавить ветку для `textStack`
- рендерить отдельный shell вместо `JsonSlideShell`

Добавить новый файл, например [src/presentation/json-renderer/JsonTextStackShell.tsx](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/json-renderer/JsonTextStackShell.tsx):
- использовать `SlideFrame`, `SlideBackdrop`, `SlideBackdropFrame`, `SlideContent`, `Reveal`, `Text`
- не использовать `SlideHeader`
- собирать вертикальный стек по `stack.justify`
- применять `align` и gap
- рендерить `text` item через `Text`
- рендерить `link` item как `<a>` со стилем, повторяющим legacy minimal-title ссылки
- рассчитывать delay как `baseDelay + index * step`

Стили link-item взять из [src/presentation/slides/MinimalTitleSlide.tsx](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/slides/MinimalTitleSlide.tsx) и [src/presentation/slides/MinimalTitleMultiLinkSlide.tsx](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/slides/MinimalTitleMultiLinkSlide.tsx), но инкапсулировать внутри нового shell, не в JSON.

### 4. Документация
Обновить [src/presentation/json-renderer/README.md](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/json-renderer/README.md):
- описать новый `template: "textStack"`
- задокументировать `stack` и оба item-type
- явно прописать, что это путь для minimal-title/about-me-подобных слайдов
- отдельно указать ограничение: inline rich text пока не поддерживается
- добавить 1-2 минимальных JSON-примера

### 5. Демо-схемы и миграция примеров
Создать хотя бы два JSON-примера в [src/presentation/schemas](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/schemas):
- минимальный title/link слайд
- about-me-подобный стек строк

После этого зарегистрировать их в [src/presentation/jsonSlideDocumentRegistry.ts](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/jsonSlideDocumentRegistry.ts) и временно использовать как скрытые demo или как миграцию выбранных legacy-слайдов, в зависимости от следующего шага.

Для первой безопасной итерации лучше:
- сначала завести hidden demo entries в [src/presentation/decks/mainDeck.ts](/Users/jn0izzze/OtherAIPro/newgen/src/presentation/decks/mainDeck.ts)
- проверить визуальный паритет
- только потом мигрировать реальные `about-me` / minimal-title записи

## Что не делать в первой итерации
- не добавлять arbitrary `className` в JSON
- не добавлять rich text parts/spans
- не смешивать `textStack` с card component registry
- не пытаться посадить это на существующий `default` + `header/layout`
- не расширять `card.items[]` ради root text stack

## Минимальный критерий готовности
- JSON-документ может описать центрированный слайд без `header`
- `text` item рендерится через `Text.tsx` с allowlist-параметрами
- `link` item поддерживает один и несколько внешних линков
- `Reveal` работает поэлементно через `baseDelay + step`
- README и типы синхронизированы
- есть хотя бы два рабочих schema-примера: minimal-title и about-me
