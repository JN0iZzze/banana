---
name: creator wrapper sections
overview: "Починить отображение и работу document-level wrapper секций (`Frame`, `Content`, `Backdrop`) для `default`-слайдов в Creator, чтобы split/equal/grid layout документы вели себя так же предсказуемо, как `textStack`, и не зависели от необязательного `template: \"default\"` в нормализованном JSON."
todos:
  - id: add-wrapper-predicate
    content: Определить единый predicate для wrapper-capable документов без зависимости от `template === 'default'`
    status: completed
  - id: update-slide-inspector
    content: Перевести `SlideInspector` на новый predicate для показа `Frame/Content/Backdrop`
    status: completed
  - id: update-slide-actions
    content: Перевести `slideActions.supportsWrappers()` на тот же predicate
    status: completed
  - id: verify-default-textstack-imagecover
    content: Проверить сценарии `default`, `textStack` и `imageCover`, затем прогнать typecheck/build
    status: completed
isProject: false
---

# Fix Wrapper Sections For Default Slides

## Problem
`SlideInspector` и `slideActions` определяют «документ с wrapper-секциями» через строгую проверку `doc.template === 'default' || doc.template === 'textStack'`.

Это ломается на normalzed `validation.doc`, потому что layout-документы после парсинга приходят как `JsonSlideDefaultDocument` **без явного `template` поля**.

Ключевые места:
- [`src/creator/editor/inspector/SlideInspector.tsx`](src/creator/editor/inspector/SlideInspector.tsx) — секции `Frame`, `Content`, `Backdrop` скрываются для `default`-ветки.
- [`src/creator/editor/mutations/slideActions.ts`](src/creator/editor/mutations/slideActions.ts) — те же документы ошибочно считаются не поддерживающими wrapper updates.
- [`src/presentation/parseJsonSlideDocument.ts`](src/presentation/parseJsonSlideDocument.ts) — подтверждает, что normalzed `JsonSlideDefaultDocument` собирается без `template`.

## Intended Behavior
- `imageCover` не должен показывать и не должен принимать `frame/content/backdrop`.
- `textStack` должен показывать и уметь править `frame/content/backdrop`.
- `default` layout-слайды (`splitLayout`, `equalColumns`, `uniformGrid`, и т.д.) тоже должны показывать и уметь править `frame/content/backdrop`, даже если в raw JSON нет `template: 'default'` и даже если сами wrapper-поля пока отсутствуют.

## Implementation Plan

### 1. Вынести корректный predicate для wrapper-capable documents
Вместо проверки на `template === 'default'` использовать один канонический predicate уровня presentation/editor boundary:
- либо `doc.template !== 'imageCover'`
- либо более явный type guard по shape (`'cover' in doc` => imageCover, иначе wrapper-capable doc)

Важно, чтобы predicate одинаково трактовал:
- normalzed `default` docs без `template`
- `textStack`
- `imageCover`

Лучше держать одну точку правды, а не дублировать условие по файлам.

### 2. Починить показ секций в `SlideInspector`
В [`src/creator/editor/inspector/SlideInspector.tsx`](src/creator/editor/inspector/SlideInspector.tsx):
- заменить inline-проверку `doc.template === 'default' || doc.template === 'textStack'`
- рендерить `FrameSection`, `ContentSection`, `BackdropSection` через новый predicate
- сохранить текущую семантику `doc.frame ?? {}`, `doc.content ?? {}`, `doc.backdrop ?? {}` — секции должны быть видны даже когда поля ещё не записаны в JSON

### 3. Починить semantic actions для тех же документов
В [`src/creator/editor/mutations/slideActions.ts`](src/creator/editor/mutations/slideActions.ts):
- заменить текущий `supportsWrappers()`
- убедиться, что `updateFrame`, `updateContent`, `updateBackdrop` работают для normalzed `default` docs
- оставить `imageCover` честным no-op

Это важно, иначе UI начнёт показывать секции, но действия всё ещё будут молча игнорироваться.

### 4. Пройтись по соседним template-check местам и не расширять баг дальше
Сделать короткий аудит всех мест, где `default` определяется через `template === 'default'`, и оставить только те проверки, где это действительно безопасно.

Сейчас уже известны два проблемных места:
- [`src/creator/editor/inspector/SlideInspector.tsx`](src/creator/editor/inspector/SlideInspector.tsx)
- [`src/creator/editor/mutations/slideActions.ts`](src/creator/editor/mutations/slideActions.ts)

Если других runtime-зависимых мест нет, фикс можно держать локальным.

## Verification
- Создать новый `splitLayout` слайд через Creator и убедиться, что видны секции `Frame`, `Content`, `Backdrop`.
- Изменить по одному полю в каждой секции и проверить, что JSON документа реально обновляется.
- Проверить, что `textStack` не регресснул.
- Проверить, что `imageCover` по-прежнему не показывает эти секции.
- Прогнать `npm run typecheck` и `npm run build`.

## Notes
Это не история про «надо дописывать поля в стартовый JSON». Секции должны работать даже при пустых wrapper-объектах. Проблема именно в неверной дискриминации normalzed `default` documents после `parseJsonSlideDocument()`.