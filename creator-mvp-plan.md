# Creator MVP Plan

## Цель

Сделать внутри текущего проекта отдельный sub app `Creator` для создания и редактирования презентаций на существующем JSON-движке.

Ограничения первой версии:

- только JSON-based слайды;
- без поддержки кастомных `.tsx` слайдов;
- без AI-функций на первом этапе;
- без экспорта в PDF;
- без свободного canvas и drag-and-drop layout builder;
- используем существующий `JsonSlideRenderer` и текущий JSON-контракт как основу рантайма.

## Что считаем MVP

Пользователь может:

1. создать деку;
2. добавить, удалить, дублировать и переставить JSON-слайды;
3. редактировать содержимое слайдов через schema-aware UI и raw JSON fallback;
4. видеть live preview через текущий presentation engine;
5. сохранять деку в БД;
6. открывать деку в отдельном режиме просмотра.

## Позиционирование

`Creator` не заменяет текущие showcase-деки `/` и `/vibecoding`.

Он добавляется как отдельный продуктовый слой поверх существующего presentation runtime:

- текущий `presentation/` остаётся rendering engine;
- новый `creator/` становится authoring layer;
- источник правды для пользовательских дек хранится в БД, а не в импортируемых `.json` файлах репозитория.

## Почему текущая база подходит

Уже есть сильное ядро, которое можно переиспользовать:

- строгий JSON-контракт для слайдов;
- `parseJsonSlideDocument()` для валидации;
- `JsonSlideRenderer` для рендера;
- фиксированный stage presentation-first формата;
- allowlist layout-ов, карточек, media и иконок.

Это хорошо подходит для MVP конструктора, потому что пользователь и будущий AI будут работать не с произвольным React, а с ограниченным DSL.

## Архитектурный принцип

Не строим новый движок слайдов.

Строим слой хранения, редактирования и просмотра поверх текущего runtime:

1. пользователь редактирует структуру слайда;
2. структура сохраняется как `json_document`;
3. документ прогоняется через существующий parser;
4. preview и present mode используют текущий renderer.

## Отдельный sub app

Новый sub app: `Creator`

Роуты первой версии:

- `/creator` — список дек;
- `/creator/decks/:deckId` — редактор деки;
- `/creator/decks/:deckId/slides/:slideId` — deep link на конкретный слайд;
- `/creator/decks/:deckId/present` — просмотр деки через текущий presentation runtime.

## Рекомендуемый backend

Для MVP выбрать `Supabase`.

Что это значит на практике:

- БД: `Postgres`;
- хранение JSON-документов: `jsonb`;
- ассеты: `Supabase Storage`;
- auth можно подключить позже;
- при необходимости later можно добавить свой тонкий backend/BFF, но не стартовать с него.

### Почему Supabase

- проект сейчас чисто frontend-only;
- не хочется поднимать отдельный backend только ради CRUD;
- JSON-слайды удобно хранить в `Postgres jsonb`;
- позже это нормально масштабируется под AI jobs, версии, access control и assets.

## Что не делаем в первой версии

- AI generation/rewrite;
- custom React slides;
- PDF export;
- PPTX export/import;
- collaborative editing;
- arbitrary drag-and-drop canvas;
- произвольные темы beyond current presentation language;
- сложную серверную оркестрацию.

## Data model

### Таблица `creator_decks`

Одна строка = одна дека.

Поля:

- `id`
- `title`
- `slug`
- `description`
- `theme`
- `status` (`draft | ready | archived`)
- `created_at`
- `updated_at`

### Таблица `creator_slides`

Одна строка = один слайд.

Поля:

- `id`
- `deck_id`
- `position`
- `title`
- `theme`
- `hidden`
- `notes`
- `json_document` (`jsonb`)
- `validation_status` (`valid | invalid`)
- `validation_error`
- `created_at`
- `updated_at`

### Таблица `creator_assets`

Минимальный учёт ассетов для image/video.

Поля:

- `id`
- `deck_id`
- `kind` (`image | video`)
- `url`
- `alt`
- `width`
- `height`
- `duration_ms`
- `created_at`

### Таблица `creator_deck_versions`

Не обязательна в день 1, но желательно заложить рано.

Поля:

- `id`
- `deck_id`
- `version_number`
- `snapshot` (`jsonb`)
- `created_at`
- `created_by`

## Domain model в приложении

Нужен отдельный client-side слой, не равный SQL-таблицам 1-в-1.

Пример:

```ts
type CreatorDeck = {
  id: string;
  title: string;
  slug: string;
  theme: 'editorial' | 'signal' | 'cinema';
  status: 'draft' | 'ready' | 'archived';
  slides: CreatorSlide[];
};

type CreatorSlide = {
  id: string;
  title: string;
  theme: 'editorial' | 'signal' | 'cinema';
  hidden?: boolean;
  notes?: string;
  jsonDocument: unknown;
  validation: {
    status: 'valid' | 'invalid';
    error?: string;
  };
};
```

## Структура кода

Предлагаемая новая зона в проекте:

```text
src/
  creator/
    app/
    routes/
    pages/
    layout/
    data/
    domain/
    editor/
    preview/
    validation/
    adapters/
```

### Ответственность слоёв

- `app/`, `routes/`, `pages/`: роутинг и входы в sub app;
- `layout/`: shell редактора;
- `data/`: репозитории и интеграция с Supabase;
- `domain/`: типы, команды, state model;
- `editor/`: UI редактирования;
- `preview/`: live preview и present mode;
- `validation/`: обёртка над parser;
- `adapters/`: преобразование `CreatorDeck` -> `DeckDefinition`.

## Editor MVP

### Layout редактора

Трёхколоночный интерфейс:

- слева список слайдов;
- в центре preview;
- справа inspector.

### Базовые операции

- создать деку;
- переименовать деку;
- создать слайд;
- удалить слайд;
- дублировать слайд;
- переставить слайды;
- скрыть/показать слайд;
- редактировать `title`, `theme`, `notes`.

### Редактирование содержимого слайда

Два режима:

#### 1. Structured mode

UI для поддерживаемых полей:

- `template`
- `frame`
- `backdrop`
- `content`
- `header`
- `layout`
- `card.items`
- `textStack.items`
- `mediaGallery.items`

#### 2. Raw JSON mode

Фоллбек для опытного пользователя.

Важно: raw JSON не обходит валидацию. Он просто другой способ редактирования того же документа.

## Validation flow

На каждый save/update:

1. взять `json_document`;
2. прогнать через `parseJsonSlideDocument()`;
3. если документ валиден — сохранить как `valid`;
4. если невалиден — сохранить ошибку и показать её в UI.

MVP-поведение:

- битый слайд можно редактировать;
- preview показывает error state;
- present mode либо скрывает невалидные слайды, либо явно блокирует запуск деки, если таких слайдов слишком много.

## Preview и present mode

`Creator` не рисует свои слайды сам.

Он использует адаптер:

- `CreatorDeck` -> `DeckDefinition`
- `CreatorSlide` -> `JsonSlideDefinition`

После адаптации текущий `PresentationShell` и `JsonSlideRenderer` можно переиспользовать почти без изменения идеи.

## Assets MVP

Даже без AI нужен минимальный asset flow:

- загрузка изображения/видео;
- выбор ассета из библиотеки деки;
- подстановка URL в поддерживаемые JSON-узлы;
- базовая валидация битых ссылок.

Без этого медиа-слайды быстро станут источником ручной боли.

## Команды, которые нужно закладывать с самого начала

Даже без AI все действия лучше моделировать как доменные команды:

- `createDeck`
- `renameDeck`
- `createSlide`
- `deleteSlide`
- `duplicateSlide`
- `reorderSlides`
- `updateSlideMeta`
- `updateSlideDocument`
- `setSlideHidden`
- `attachAssetToDeck`

Это даст аккуратную архитектуру и потом позволит подключить AI поверх того же command layer, а не поверх UI.

## Этапы реализации

### Этап 1. Foundation

Цель: `Creator` появляется как sub app и умеет читать/писать деки из БД.

Сделать:

- завести роуты `/creator/*`;
- подключить Supabase project;
- создать таблицы `creator_decks` и `creator_slides`;
- реализовать базовые repository interfaces;
- сделать список дек и открытие редактора.

### Этап 2. Deck editor MVP

Цель: пользователь может вручную собрать JSON-only deck.

Сделать:

- shell редактора;
- slide list;
- CRUD по слайдам;
- reorder;
- structured inspector;
- raw JSON editor;
- validation panel.

### Этап 3. Preview / present

Цель: созданную деку можно полноценно просматривать.

Сделать:

- adapter в формат текущего runtime;
- live preview в редакторе;
- отдельный present route;
- корректный error state для невалидных слайдов.

### Этап 4. Assets

Цель: поддержать реальные image/video внутри JSON docs.

Сделать:

- `creator_assets`;
- загрузку в storage;
- asset picker;
- подстановку ссылок в поддерживаемые узлы документов.

### Этап 5. Versioning

Цель: безопасные итерации и база для будущих AI-функций.

Сделать:

- snapshots деки;
- rollback к версии;
- грубую историю изменений.

## Критерии готовности MVP

MVP можно считать собранным, если:

- новая дека создаётся без правки кода и без правки файлов в репозитории;
- слайды живут в БД;
- можно руками собрать JSON-only deck;
- есть live preview;
- есть present mode;
- валидация встроена в продуктовый поток;
- media assets подключаются без ручной возни с путями;
- текущий renderer остаётся единым движком просмотра.

## Следующий логичный шаг после MVP

После стабилизации ручного `Creator` можно переходить к AI-слою:

- AI создаёт deck draft;
- AI редактирует отдельные JSON documents;
- AI предлагает рефактор layout/content внутри текущего DSL;
- человек работает поверх тех же сущностей, а не поверх отдельной магии.

Это важно: сначала нужен надёжный authoring runtime, потом AI.

## Технический долг / известные риски (тестовый проект)

Сейчас `Creator` задуман как прототип: скорость важнее «боевой» безопасности и сильных инвариантов на уровне БД. Ниже зафиксированы осознанные трейд-оффы, которые нужно снять перед реальным деплоем/шарингом.

- **RLS и доступ к таблицам**
  - В миграциях RLS отключён на `creator_*` таблицах, чтобы упростить разработку без auth.
  - **Долг:** включить RLS + политики, завязанные на `auth.uid()` (или другой model доступа) после появления логина.

- **Storage bucket public**
  - `creator-assets` сейчас public bucket, чтобы упростить ссылки/просмотр.
  - **Долг:** private bucket + signed URLs + политики на upload/delete/list.

- **Reorder слайдов не транзакционный end-to-end**
  - Двухфазный reorder (отрицательные `order_index` → финальные) сделан на клиенте серией отдельных updates.
  - **Риск/долг:** при обрыве сети/refresh посередине можно получить “полусобранный” порядок.
  - **Правка:** вынести в Postgres RPC, который делает обе фазы в одной транзакции.

- **Параллельные create/duplicate слайдов**
  - `order_index` вычисляется как `max + 1` на клиенте.
  - **Риск/долг:** гонка из двух вкладок/двойного клика → конфликт уникальности по `(deck_id, order_index)`.
  - **Правка:** server-side `next_order_index` или insert с конфликтом и retry, или `serializable` транзакция.

- **Fixed dev user id**
  - Используется константный `DEV_USER_ID` для `created_by` пока нет настоящей auth-интеграции.
  - **Долг:** заменить на `auth.user().id` и реальные ownership поля/индексы.

- **Агрегации/листинги “на дешёвом SQL”**
  - Некоторые списки могут тянуть больше данных, чем нужно (например, подсчёты через дополнительные select’ы).
  - **Долг:** оптимизировать через SQL views, `count(*) filter`, материализованные счётчики — когда объёмы вырастут.
