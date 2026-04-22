# CLAUDE.md

## Проект
`newgen` — Vite + React приложение, которое рендерит презентационные деки. Деки собираются в [src/presentation/decks/](src/presentation/decks/), большинство слайдов описаны JSON-схемами и рендерятся общим рендерером [src/presentation/json-renderer/](src/presentation/json-renderer/).

Контент на русском.

## Активный фокус
**Презентация «Вайбкодинг»** (дека `/vibecoding`). Остальные деки стабильны — правки по умолчанию ограничены этой декой.

Ключевые файлы:
- [src/presentation/decks/vibecodingDeck.ts](src/presentation/decks/vibecodingDeck.ts) — состав, порядок, заголовки, заметки для докладчика.
- [src/presentation/decks/vibecodingSlideIds.ts](src/presentation/decks/vibecodingSlideIds.ts) — реестр id слайдов. **Сейчас пустой** — дека пересобирается с нуля по новому сценарию (апрель 2026).
- [src/presentation/decks/vibecoding/jsonSlides.ts](src/presentation/decks/vibecoding/jsonSlides.ts) — активные JSON-слайды деки (сейчас пустой массив, заполняется по мере рендера из md-реестра).
- [src/presentation/decks/vibecoding/schemas/](src/presentation/decks/vibecoding/schemas/) — JSON-схемы деки «Вайбкодинг» (папка создаётся при первом слайде). Схемы деки **main** лежат в [src/presentation/decks/main/schemas/](src/presentation/decks/main/schemas/).
- [src/presentation/decks/vibecoding/archive/](src/presentation/decks/vibecoding/archive/) — **архив прежней версии деки** (18 слайдов и legacy-ключи). Не импортируется декой; доступен для справки и заимствований через `vibecodingLegacyJsonSlides` и `VIBECODING_LEGACY_SLIDE_IDS`.
- [src/presentation/decks/defineJsonSlide.ts](src/presentation/decks/defineJsonSlide.ts) — фабрика JSON-слайда: валидация `raw` JSON и поле `jsonDocument` на слайде.
- [src/presentation/decks/main/jsonSlides.ts](src/presentation/decks/main/jsonSlides.ts) / [src/presentation/decks/vibecoding/jsonSlides.ts](src/presentation/decks/vibecoding/jsonSlides.ts) — сборка JSON-слайдов деки (импорты схем + `defineJsonSlide`).
- [src/presentation/decks/mainSlideIds.ts](src/presentation/decks/mainSlideIds.ts) — стабильные `id` для main JSON-слайдов (`DEMO_JSON_SLIDE_IDS`, `MIGRATED_JSON_SLIDE_IDS`).
- [todo.md](todo.md) — идеи, ещё не распределённые по слайдам.
- [Вайбкодинг_ обзор, инструменты, архитектура.md](Вайбкодинг_%20обзор,%20инструменты,%20архитектура.md) — исходные заметки к докладу.

## Как устроены JSON-слайды (кратко)
1. Схема в `src/presentation/decks/<deckId>/schemas/` описывает `frame`, `backdrop`, `content`, `header`, `layout` (для `main` и `vibecoding` — в своих папках `schemas` рядом с `*Deck.ts`).
2. Слайд собирается через `defineJsonSlide` (в `main/jsonSlides.ts` или `vibecoding/jsonSlides.ts`); валидированный документ лежит в `slide.jsonDocument`.
3. Запись в `mainDeck.ts` / `vibecodingDeck.ts` ссылается на готовый слайд (или для legacy — обычный `component: SomeSlide`).
4. `JsonSlideRenderer` читает `slide.jsonDocument` и диспатчит один из лэйаутов: `equalColumns`, `asymmetricColumns`, `splitLayout`, `stackLayout`, `uniformGrid`, `bentoGrid`, `mediaGallery`, плюс шаблоны `textStack` и `imageCover`.

Полный контракт (лэйауты, карточки, `items[]`, компоненты, типографика) — [src/presentation/json-renderer/README.md](src/presentation/json-renderer/README.md). Это главный источник правды для всего, что касается JSON-рендерера.

## Текущая задача (2026-04-22)
Перестраиваем деку вайбкодинга с нуля. **Код пока не трогаем.** Работаем в режиме планирования:
1. Составить сторителлинг-реестр в markdown: по одному блоку на слайд — тексты и выбранный формат лэйаута, без JSON.
2. Итерировать, пока сценарий не читается как связный цельный текст.
3. Только после утверждения реестра — рендер в JSON пачками через скилл `json-slide-creator`.

### Рабочие правила этой задачи
- **Режим «план».** Никаких правок кода или схем, пока пользователь явно не скажет «поехали». Только markdown и обсуждение.
- **Один слайд = один вопрос.** У каждого слайда есть поле «вопрос зрителя». Не можем сформулировать — слайд лишний.
- **Заголовок = ответ, а не тема.** Не «Архитектура», а «Держи файлы маленькими». Формулировки вида «Артефакт силы I/II/III» в заголовках запрещены.
- **Словарь лэйаутов — до контента.** Форматы слайдов называем именами из рендерера (`equalColumns`, `splitLayout` и т.д.). Не придумываем того, чего нет.
- **Аудитория зафиксирована в шапке реестра.** Каждый слайд сверяется с ней. Если требует знаний, которых у аудитории нет — переписать или выкинуть.
- **Тон: живой русский, без AI-штампов.** Перед рендером прогоняем тексты через скилл `humanizer`.
- **Единый источник правды — md-реестр.** Решение поменялось — правим сначала md, потом всё остальное.

## Сборка и проверка
- `npm run typecheck`
- `npm run build`
- `npm run dev`

После любой правки JSON-схемы гнать `typecheck` и `build`, как требует README JSON-рендерера.
