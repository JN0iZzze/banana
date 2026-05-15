/**
 * Semantic action API for Creator inspector layer (этап 2 плана
 * `creator-semantic-mutations`).
 *
 * Здесь живут *интерфейсы* доменных операций для inspector UI: каждый
 * интерфейс описывает, что можно сделать с конкретным выбранным узлом
 * (header / card / quote / textRegion / layout / stack / imageCover-*),
 * не раскрывая его JSON-shape.
 *
 * Контракт:
 *   - Все методы возвращают `void` (применили — обновили документ через
 *     внутренний `commit`).
 *   - Опциональные поля принимают `value | null`, где `null` означает
 *     «очистить поле» (удалить ключ из объекта).
 *   - Обязательные поля принимают только валидное значение (никогда `null`).
 *   - Для текстовых полей с семантикой «пустая строка = очистить» (в первую
 *     очередь quote.label/subtitle/text) явно используется `string | null`,
 *     при этом фабрика трактует пустую строку как `null` (чтобы не оставлять
 *     лишних пустых ключей в JSON).
 *
 * Сами фабрики, реализующие эти интерфейсы, лежат в `./nodeActions.ts`.
 * UI этими интерфейсами пока не пользуется — kind-инспекторы переедут на них
 * на следующем этапе плана.
 *
 * Источник правды для shape узлов — `src/presentation/jsonSlideTypes.ts`.
 */

import type {
  JsonImageCoverBackground,
  JsonImageCoverHeadline,
  JsonImageCoverHeadlineStack,
  JsonImageCoverOverlay,
  JsonSlideBackdrop,
  JsonSlideCard,
  JsonSlideCardJustify,
  JsonSlideCardPadding,
  JsonSlideCardSurface,
  JsonSlideCardTone,
  JsonSlideContent,
  JsonSlideFrame,
  JsonSlideGridGap,
  JsonSlideHeaderAlign,
  JsonSlideTextRegionAlign,
  JsonSlideTextStackAlign,
  JsonSlideTextStackJustify,
} from '../../../presentation/jsonSlideTypes';
import type { SlideTheme } from '../../../presentation/types';

// --- slide -----------------------------------------------------------------

/**
 * Slide-level действия. В отличие от kind-actions, не привязаны к node-path:
 * меняют либо meta слайда (`title`, `speakerNotes`) через `updateSlideMeta`,
 * либо корневые поля документа (`theme`, `frame`, `content`, `backdrop`)
 * через `updateSlideDocument`.
 *
 * - `updateTitle`, `updateSpeakerNotes` — служебные строковые поля слайда.
 *   `null` сбрасывает поле (стор уже умеет принимать `null`).
 * - `updateTheme` — корневой `theme` документа. `null` удаляет ключ.
 * - `updateFrame` / `updateContent` / `updateBackdrop` — иммутабельная правка
 *   соответствующего wrapper-объекта в документе. Принимают mutator вида
 *   `(current) => next | null`. `null` (либо пустой объект) — удалить ключ
 *   из документа целиком. Для шаблонов, у которых нет этих обёрток
 *   (`imageCover`), вызов — no-op (логика спрятана в фабрике).
 */
export interface SlideActions {
  updateTitle(value: string | null): void;
  updateSpeakerNotes(value: string | null): void;
  updateTheme(value: SlideTheme | null): void;
  updateFrame(mutator: (current: JsonSlideFrame) => JsonSlideFrame | null): void;
  updateContent(mutator: (current: JsonSlideContent) => JsonSlideContent | null): void;
  updateBackdrop(mutator: (current: JsonSlideBackdrop) => JsonSlideBackdrop | null): void;
}

// --- header ----------------------------------------------------------------

/**
 * Действия над `JsonSlideHeader`. Path в селекшене указывает на сам объект
 * `header` в `JsonSlideDefaultDocument`.
 *
 * - `updateMeta` — пишет обязательное поле `meta` (пустая строка допустима
 *   на уровне типа: валидация лежит на schema-слое слайда).
 * - `updateAlign` — пишет опциональное `align`. `null` очищает поле
 *   (возвращает поведение по умолчанию — `left`).
 *
 * `title` и `lead` намеренно не входят в этот API: они правятся inline на
 * сцене (двойной клик), как и в текущем `HeaderInspector`.
 */
export interface HeaderActions {
  updateMeta(value: string): void;
  updateAlign(value: JsonSlideHeaderAlign | null): void;
}

// --- card ------------------------------------------------------------------

/**
 * Действия над `JsonSlideCard`. Path указывает на сам объект карточки в
 * текущем документе.
 *
 * - `updateTone` — обязательное поле `tone` (`standard | accent`),
 *   `null` не принимается.
 * - `updatePadding`, `updateSurface`, `updateStackGap`, `updateJustify` —
 *   опциональные поля карточки. `null` очищает поле (возвращает поведение
 *   по умолчанию рендерера).
 *
 * Структурные правки `items` / `slots` сюда не входят — это волна 2
 * рефакторинга карточек.
 */
export interface CardActions {
  updateTone(value: JsonSlideCardTone): void;
  updatePadding(value: JsonSlideCardPadding | null): void;
  updateSurface(value: JsonSlideCardSurface | null): void;
  updateStackGap(value: JsonSlideGridGap | null): void;
  updateJustify(value: JsonSlideCardJustify | null): void;
}

// --- quote -----------------------------------------------------------------

/**
 * Действия над `JsonSlideQuote`. Path указывает на сам объект цитаты.
 *
 * Все три поля опциональны; `value: string | null` со специальной
 * семантикой: пустая строка трактуется как «очистить» — фабрика удаляет
 * ключ из JSON, чтобы не оставлять `label: ''` в документе.
 *
 * `paragraphs` сюда не входит — это волна 2.
 */
export interface QuoteActions {
  updateLabel(value: string | null): void;
  updateSubtitle(value: string | null): void;
  updateText(value: string | null): void;
}

// --- text region -----------------------------------------------------------

/**
 * Действия над `JsonSlideTextRegionPayload` (text-регион внутри
 * `splitLayout` / `stackLayout`).
 *
 * Path указывает на сам объект payload (например,
 * `layout.left.text` или `layout.items.2.region.text`).
 *
 * Оба поля опциональные, `null` очищает.
 */
export interface TextRegionActions {
  updateAlign(value: JsonSlideTextRegionAlign | null): void;
  updateStackGap(value: JsonSlideGridGap | null): void;
}

// --- layout ----------------------------------------------------------------

/**
 * Действия над `JsonSlideLayout`. Path указывает на сам объект layout.
 *
 * - `updateGap` — общий для всех вариантов опциональный gap, `null` очищает.
 * - `updateColumns`, `updateRows` — валидны только для `uniformGrid` /
 *   `bentoGrid`. Тип фабрики просто принимает `number`; ветка по
 *   `layout.type` выполняется внутри реализации (вызов на неподходящем
 *   типе — no-op).
 * - `updateSplitSpans` — валиден только для `splitLayout`. Принимает
 *   согласованную пару `{ left, right }`. Инвариант геометрии
 *   (`left` + `right` === 12, оба — целые 1..11) защищается не UI, а
 *   фабрикой: `left` берётся за источник правды, `rightSpan` всегда
 *   пересчитывается как `12 - left`. Невалидный `left` → честный no-op
 *   (документ не коммитится, неконсистентная геометрия не пишется).
 *
 * Менять `layout.type` через этот API нельзя: смена типа ломает всю
 * внутреннюю структуру и должна идти отдельным сценарием.
 */
export interface LayoutActions {
  updateGap(value: JsonSlideGridGap | null): void;
  updateColumns(value: number): void;
  updateRows(value: number): void;
  updateSplitSpans(value: { left: number; right: number }): void;
}

// --- stack -----------------------------------------------------------------

/**
 * Действия над `JsonSlideTextStack` (корневой `stack` в
 * `JsonSlideTextStackDocument`).
 *
 * - `updateAlign`, `updateJustify` — обязательные поля; `null` не принимается.
 * - `updateGap` — опциональный, `null` очищает.
 *
 * Структурные правки `items` сюда не входят.
 */
export interface StackActions {
  updateAlign(value: JsonSlideTextStackAlign): void;
  updateJustify(value: JsonSlideTextStackJustify): void;
  updateGap(value: JsonSlideGridGap | null): void;
}

// --- image cover · background ----------------------------------------------

/**
 * Действия над `JsonImageCoverBackground` (`cover.background`).
 *
 * - `updateSrc(url, meta?)` — обновляет обязательный `src`. Если у
 *   AssetPicker есть `meta.alt` и текущий `alt` пуст/не задан — фабрика
 *   автоматически подставит `meta.alt` (поведение сохранено из текущего
 *   `ImageCoverInspector.BackgroundInspector`).
 * - `updateAlt` — опциональный, `null` (или пустая строка) очищает поле.
 * - `updateOverlay` — обязательный enum `JsonImageCoverOverlay`.
 */
export interface ImageCoverBackgroundActions {
  updateSrc(url: string, meta?: { alt?: string }): void;
  updateAlt(value: string | null): void;
  updateOverlay(value: JsonImageCoverOverlay): void;
}

// --- image cover · headline ------------------------------------------------

/**
 * Действия над `JsonImageCoverHeadline` (`cover.headline`).
 *
 * Обязательные поля; `null` не принимается. Изменение `align` / `blocks`
 * / `color` / `font` сюда не входит — это волна 2 для headline.
 */
export interface ImageCoverHeadlineActions {
  updateStack(value: JsonImageCoverHeadlineStack): void;
  updateOffsetYPx(value: 100 | 220 | 280): void;
}

// --- image cover · rail item -----------------------------------------------

/**
 * Действия над одним элементом rail (`JsonImageCoverRailItem`) в
 * `cover.topRail.items.<i>` или `cover.bottomRail.items.<i>`.
 *
 * Внутри фабрики — ветка по `kind`:
 *   - `text` → пишутся `style` / `textAlign`;
 *   - `cluster` → пишется `gap`.
 *
 * Вызов «не своего» метода (например, `updateClusterGap` на text-элементе)
 * — no-op: фабрика читает текущий узел и тихо игнорирует, чтобы не
 * разбивать структуру.
 *
 * Сами `lines` / `items` правятся отдельно (волна 2).
 */
export interface ImageCoverRailItemActions {
  updateTextStyle(value: 'plain' | 'label' | 'inverted'): void;
  updateTextAlign(value: 'left' | 'center' | 'right'): void;
  updateClusterGap(value: 'md' | 'lg'): void;
}

// --- references for IDE go-to-def ------------------------------------------

// Тип-якоря, чтобы IDE подсказывала, что shape живёт в jsonSlideTypes.ts.
// Не используются в рантайме.
export type _ShapeAnchor =
  | JsonImageCoverBackground
  | JsonImageCoverHeadline
  | JsonSlideCard;
