---
name: json-slide-creator
description: Создаёт и редактирует слайды на JSON-архитектуре `JsonSlideRenderer`: находит слайд по `id`, номеру, названию или пути, меняет JSON-схему, layout, регистрацию в деках и поддерживаемый контракт рендера. Используется при создании нового JSON-слайда, правке существующего, выборе layout, работе с `defineJsonSlide`, `mainDeck.ts`, `vibecodingDeck.ts` и миграционных решениях для legacy-слайдов.
---

# JSON Slide Creator

Скилл только про структуру слайда, JSON-контракт и регистрацию в деках.

Если задача про заголовки, `lead`, tone of voice, сторителлинг или редактуру формулировок, дополнительно прочитай `../json-slide-tone-of-voice/SKILL.md`.

Подробный контракт и примеры находятся в `src/presentation/json-renderer/README.md`. Этот файл — краткий рабочий протокол.

## Когда применять

Применяй скилл, когда нужно:

- создать новый слайд на `JsonSlideRenderer`;
- изменить существующий JSON-слайд;
- найти слайд по номеру, названию, `id` или пути к схеме;
- обновить JSON-схему, layout, карточки или регистрацию слайда;
- понять, JSON это или legacy;
- решить, помещается ли слайд в текущий JSON-контракт.

## Главное правило

Работай через новую JSON-архитектуру только если целевой слайд использует `JsonSlideRenderer`.

Если запрос относится к legacy-слайду, который рендерится обычным `.tsx` компонентом, не вноси правки сразу. Сначала:

1. Явно сообщи, что это legacy-слайд, а не JSON-renderer слайд.
2. Спроси, что именно хочет пользователь:
   - точечно править legacy-слайд как есть;
   - перевести его на `JsonSlideRenderer`.
3. До начала правок дай конкретные замечания:
   - можно ли выразить слайд через существующий JSON-контракт;
   - какой layout подходит;
   - что не помещается в текущие ограничения JSON;
   - есть ли риск, что миграция будет искусственной и лучше оставить `.tsx`.

Без такого подтверждения legacy-файл не редактируй.

## Как определить целевой слайд

Пользователь может ссылаться на слайд разными способами. Разрешай цель в таком порядке:

1. Если дан явный путь к JSON-файлу, работай с ним напрямую.
2. Если дан путь к `.tsx` файлу слайда, проверь, это JSON-слайд или legacy.
3. Если пользователь указывает номер, название или `id`, найди запись в `src/presentation/decks/mainDeck.ts` или `src/presentation/decks/vibecodingDeck.ts`.
4. Если слайд пришёл из `defineJsonSlide` и имеет `jsonDocument`, ищи исходную схему в `decks/main/schemas/`, `decks/vibecoding/schemas/`, `decks/main/jsonSlides.ts` или `decks/vibecoding/jsonSlides.ts`.
5. Если соответствие неоднозначно, сначала уточни у пользователя, а не гадай.

## Рабочий процесс

### Новый JSON-слайд

1. Создай JSON-схему в `src/presentation/decks/main/schemas/` или `src/presentation/decks/vibecoding/schemas/`.
2. Для `backdrop.variant` = `spotlight` или `none` добавь `"borderFrame": true`, если пользователь явно не просит слайд без рамки.
3. Для `grid` и `mesh` не ставь `borderFrame: true`: рамка уже внутри `SlideBackdrop`.
4. Добавь слайд через `defineJsonSlide` в `src/presentation/decks/main/jsonSlides.ts` или `src/presentation/decks/vibecoding/jsonSlides.ts`.
5. Подключи его в `mainDeck.ts` или список в `vibecoding/jsonSlides.ts`.
6. При необходимости добавь стабильный `id` в `mainSlideIds.ts` или `vibecodingSlideIds.ts`.
7. Заполняй только поддерживаемые поля контракта.
8. Проверь `npm run typecheck` и `npm run build`.

### Редактирование существующего JSON-слайда

1. Найди запись в `mainDeck.ts` или `vibecodingDeck.ts`.
2. Найди связанную JSON-схему по `decks/main/jsonSlides.ts`, `decks/vibecoding/jsonSlides.ts` или прямому пути к `.json`.
3. Вноси изменения прежде всего в JSON-схему.
4. Меняй деку только если действительно нужно обновить `id`, `title`, `notes`, `hidden` или саму регистрацию.
5. Если для задачи не хватает текущего контракта, остановись и сначала объясни ограничение пользователю.

## Краткий контракт JSON Renderer

Полный контракт см. в `src/presentation/json-renderer/README.md`. Ниже только базовые ограничения.

### Верхний уровень документа

Допустимые top-level поля:

- `frame`
- `backdrop`
- `content`
- `header`
- `layout`

Не придумывай дополнительные секции.

### Поддерживаемые top-level опции

- `frame.align`: `top` | `center` | `bottom`
- `frame.padding`: `compact` | `default` | `spacious`
- `backdrop.variant`: `grid` | `mesh` | `spotlight` | `none`
- `backdrop.borderFrame`: только для `spotlight` / `none`, если нужна рамка
- `content.width`: `full` | `wide` | `content` | `narrow`
- `content.density`: `compact` | `comfortable` | `relaxed`
- `content.align`: `left` | `center`
- `header.meta`: обязательная строка
- `header.title`: опциональная строка
- `header.lead`: опциональная строка

### Layout presets

Разрешены только:

- `asymmetricColumns`
- `equalColumns`
- `bentoGrid`
- `uniformGrid`
- `splitLayout`
- `stackLayout`
- `mediaGallery`

У любого layout-объекта опционально поле **`decorations`** — строго типизированный декоративный слой поверх области лэйаута (не поверх header). См. `src/presentation/json-renderer/README.md` → «Layout decorations».

Правила выбора:

- `asymmetricColumns` для явной разницы ширин;
- `equalColumns` для равных колонок;
- `bentoGrid` для ручного позиционирования ячеек;
- `uniformGrid` для повторяемой сетки одинаковых карточек.

Не изобретай новые layout type без расширения рантайма и документации.

## Карточки

Старые поля `overline`, `title`, `body` на уровне card считаются устаревшими. Используй новый card contract.

Основные поля карточки:

- `tone`: `standard` | `accent`
- `padding`: `compact` | `default` | `spacious`
- `stackGap`: `xs` | `sm` | `md` | `lg`
- `leadingIcon`: только id из registry
- `watermarkIcon`: только id из registry
- `subtitle`: короткая верхняя подпись
- `justify`: `start` | `end` | `between`
- `items`: обязательный непустой массив

### `subtitle`

- `subtitle` живёт отдельно над основным стеком;
- `subtitle` не участвует в `justify`;
- для pinned label предпочитай `subtitle`;
- если подпись должна быть частью общего стека, используй обычный text item в `items[]`.

### `items[]`

Элементы бывают двух типов:

1. Текстовый item: `{ "variant": "...", "text": "..." }`
2. Компонентный item: `{ "type": "component", "component": "<id>", ... }`

Поддерживаемые текстовые `variant`:

- `overline`
- `caption`
- `h2`
- `h3`
- `body`
- `bodyLg`

Не используй:

- `h1`
- `lead`
- `meta`
- `tileAccent`

Порядок контента задаётся только порядком массива `items[]`.

### Практика хорошей карточки

- У хорошей карточки обычно есть один заметный заголовок `h2` или `h3`.
- Заголовок может жить сверху или снизу, если этого требует композиция.
- Если заголовок и описание должны читаться как один блок, держи их в одном `slot`, а не разрывай `justify: "between"`.
- `justify: "between"` используй, когда карточка действительно делится на верхнюю и нижнюю часть.
- Не оставляй при `between` визуально висящую строку посередине. В таких случаях переходи на `slots`, `start` или `end`.
- На сравнительных слайдах и в группе peer-карточек держи одинаковую структуру и одинаковый уровень типографики. Не смешивай `h2` в одной карточке и `h3` в соседней без явной причины.
- `subtitle` и `overline` — это не главный заголовок карточки, а supporting label.
- Если есть `headerBadge`, в верхней части карточки должен быть либо явный заголовок, либо иконка. Не оставляй badge в паре только с `overline` / `subtitle`.

## Component items и иконки

Можно использовать только allowlist из текущего рантайма.

Базово ориентируйся на:

- `tagList`

Если нужен новый component item:

1. Обнови типы в `src/presentation/jsonSlideTypes.ts`.
2. Добавь валидацию в `src/presentation/parseJsonSlideDocument.ts`.
3. Добавь renderer в `src/presentation/json-renderer/jsonSlideCardComponentRegistry.tsx`.
4. Задокументируй форму в `src/presentation/json-renderer/README.md`.

Не добавляй свободные `Record<string, unknown>` пропсы и не обходи parser.

`leadingIcon` и `watermarkIcon` берутся только из registry и allowlist. Если нужной иконки нет:

1. Не подставляй произвольную строку.
2. Сначала расширь registry и типы.
3. Затем используй новый id в JSON.

Для карточек про `Claude`, `Cursor` и похожие инструменты используй монохромные LobeHub-иконки из registry. Не используй цветные LobeHub-иконки.

## Жёсткие ограничения

- Не добавляй responsive Tailwind-префиксы вроде `sm:`, `md:`, `lg:` в этом пути.
- Не добавляй arbitrary `className` support в JSON.
- Не добавляй markdown, media, arbitrary React nodes или свободные nested blocks в `card.items`.
- Не расширяй контракт молча: если нужно новое поведение, явно обновляй типы, parser, renderer и документацию.

Презентация работает как fixed-stage, а не как responsive page.

## Когда не надо тащить задачу в JSON

Не пытайся насильно уложить слайд в `JsonSlideRenderer`, если ему нужны:

- изображения или видео со специальной композицией;
- графики, виджеты, кастомные React-компоненты;
- условные ветки рендера;
- layout, который не выражается через текущие presets;
- иконко- или media-специфичная логика.

В таком случае честно скажи, что лучше оставить или сделать отдельный `.tsx` слайд.

## Чеклист перед завершением

- Найден правильный тип слайда: JSON или legacy.
- Для JSON-слайда использованы только поддерживаемые поля.
- Для `spotlight` / `none` в схеме есть `backdrop.borderFrame: true`, если не договорились о слайде без рамки.
- Для `grid` / `mesh` поле `borderFrame` не добавлено.
- При необходимости обновлены `defineJsonSlide`, parser и типы, а не только схема.
- `mainDeck.ts` согласован с `main/jsonSlides.ts`; для vibecoding — `vibecoding/jsonSlides.ts` и `vibecodingSlideIds.ts`.
- Нет responsive-префиксов и произвольных классов.
- По возможности прогнаны `npm run typecheck` и `npm run build`.

## Основные файлы

- `src/presentation/json-renderer/README.md`
- `src/presentation/decks/mainDeck.ts`
- `src/presentation/decks/main/jsonSlides.ts`
- `src/presentation/decks/mainSlideIds.ts`
- `src/presentation/decks/defineJsonSlide.ts`
- `src/presentation/decks/vibecoding/jsonSlides.ts`
- `src/presentation/decks/vibecodingSlideIds.ts`
- `src/presentation/jsonSlideTypes.ts`
- `src/presentation/parseJsonSlideDocument.ts`
- `src/presentation/json-renderer/jsonSlideCardComponentRegistry.tsx`
- `src/presentation/json-renderer/jsonSlideCardIconRegistry.tsx`
