/**
 * Фабрики semantic actions для inspector layer (этап 2 плана
 * `creator-semantic-mutations`).
 *
 * Каждая `createXxxActions({ path, doc, commit })` возвращает объект,
 * реализующий соответствующий interface из `./actionTypes.ts`. Внутри
 * фабрики работают только через `documentOps` (`patchNodeByPath`,
 * `patchOptionalField`, `replaceNodeByPath`) и НЕ обращаются к стору —
 * коммит результата делегирован вызывающему коду через `commit(next)`.
 *
 * Контракт `commit`:
 *   `commit: (next: JsonSlideDocument) => void`
 *   — на вход всегда уходит уже клонированный с правкой документ.
 *
 * На текущем этапе плана эти фабрики ещё не подключены к UI; они появятся
 * в `NodeInspector` следующим коммитом.
 */

import type {
  JsonImageCoverBackground,
  JsonImageCoverHeadline,
  JsonImageCoverRailItem,
  JsonSlideBentoLayout,
  JsonSlideCard,
  JsonSlideDocument,
  JsonSlideHeader,
  JsonSlideLayout,
  JsonSlideQuote,
  JsonSlideSplitLayout,
  JsonSlideTextRegionPayload,
  JsonSlideTextStack,
  JsonSlideUniformGridLayout,
} from '../../../presentation/jsonSlideTypes';
import {
  patchNodeByPath,
  patchOptionalField,
  replaceNodeByPath,
} from './documentOps';
import type {
  CardActions,
  HeaderActions,
  ImageCoverBackgroundActions,
  ImageCoverHeadlineActions,
  ImageCoverRailItemActions,
  LayoutActions,
  QuoteActions,
  StackActions,
  TextRegionActions,
} from './actionTypes';

/**
 * Аргументы любой фабрики действий: абсолютный path к редактируемому
 * узлу, текущий документ и `commit` для отправки результата в стор.
 */
export interface NodeActionFactoryContext {
  path: string;
  doc: JsonSlideDocument;
  commit: (next: JsonSlideDocument) => void;
}

// --- internal helpers ------------------------------------------------------

/**
 * Применить mutator к узлу по path и закоммитить новый документ.
 * Все фабрики работают через эту обёртку: единая точка коммита.
 */
function applyMutation(
  ctx: NodeActionFactoryContext,
  mutator: (node: unknown) => unknown,
): void {
  const next = patchNodeByPath(ctx.doc, ctx.path, mutator) as JsonSlideDocument;
  ctx.commit(next);
}

/**
 * Заменить узел по path целиком и закоммитить.
 */
function applyReplace(ctx: NodeActionFactoryContext, value: unknown): void {
  const next = replaceNodeByPath(ctx.doc, ctx.path, value) as JsonSlideDocument;
  ctx.commit(next);
}

// --- header ----------------------------------------------------------------

export function createHeaderActions(ctx: NodeActionFactoryContext): HeaderActions {
  return {
    updateMeta(value) {
      applyMutation(ctx, (node) => ({
        ...(node as JsonSlideHeader),
        meta: value,
      }));
    },
    updateAlign(value) {
      applyMutation(ctx, (node) =>
        patchOptionalField(node as JsonSlideHeader, 'align', value ?? undefined),
      );
    },
  };
}

// --- card ------------------------------------------------------------------

export function createCardActions(ctx: NodeActionFactoryContext): CardActions {
  return {
    updateTone(value) {
      applyMutation(ctx, (node) => ({
        ...(node as JsonSlideCard),
        tone: value,
      }));
    },
    updatePadding(value) {
      applyMutation(ctx, (node) =>
        patchOptionalField(node as JsonSlideCard, 'padding', value ?? undefined),
      );
    },
    updateSurface(value) {
      applyMutation(ctx, (node) =>
        patchOptionalField(node as JsonSlideCard, 'surface', value ?? undefined),
      );
    },
    updateStackGap(value) {
      applyMutation(ctx, (node) =>
        patchOptionalField(node as JsonSlideCard, 'stackGap', value ?? undefined),
      );
    },
    updateJustify(value) {
      applyMutation(ctx, (node) =>
        patchOptionalField(node as JsonSlideCard, 'justify', value ?? undefined),
      );
    },
  };
}

// --- quote -----------------------------------------------------------------

/**
 * Семантика «пустая строка → очистить»: и `null`, и `''` приводятся к
 * `undefined`, чтобы `patchOptionalField` удалил ключ из JSON.
 */
function quoteCleared(value: string | null): string | undefined {
  if (value === null) return undefined;
  if (value === '') return undefined;
  return value;
}

export function createQuoteActions(ctx: NodeActionFactoryContext): QuoteActions {
  return {
    updateLabel(value) {
      applyMutation(ctx, (node) =>
        patchOptionalField(node as JsonSlideQuote, 'label', quoteCleared(value)),
      );
    },
    updateSubtitle(value) {
      applyMutation(ctx, (node) =>
        patchOptionalField(node as JsonSlideQuote, 'subtitle', quoteCleared(value)),
      );
    },
    updateText(value) {
      applyMutation(ctx, (node) =>
        patchOptionalField(node as JsonSlideQuote, 'text', quoteCleared(value)),
      );
    },
  };
}

// --- text region -----------------------------------------------------------

export function createTextRegionActions(
  ctx: NodeActionFactoryContext,
): TextRegionActions {
  return {
    updateAlign(value) {
      applyMutation(ctx, (node) =>
        patchOptionalField(
          node as JsonSlideTextRegionPayload,
          'align',
          value ?? undefined,
        ),
      );
    },
    updateStackGap(value) {
      applyMutation(ctx, (node) =>
        patchOptionalField(
          node as JsonSlideTextRegionPayload,
          'stackGap',
          value ?? undefined,
        ),
      );
    },
  };
}

// --- layout ----------------------------------------------------------------

export function createLayoutActions(ctx: NodeActionFactoryContext): LayoutActions {
  return {
    updateGap(value) {
      applyMutation(ctx, (node) =>
        patchOptionalField(node as JsonSlideLayout, 'gap', value ?? undefined),
      );
    },
    updateColumns(value) {
      if (!Number.isFinite(value)) return;
      applyMutation(ctx, (node) => {
        const layout = node as JsonSlideLayout;
        if (layout.type !== 'uniformGrid' && layout.type !== 'bentoGrid') {
          return layout;
        }
        return {
          ...(layout as JsonSlideUniformGridLayout | JsonSlideBentoLayout),
          columns: value,
        };
      });
    },
    updateRows(value) {
      if (!Number.isFinite(value)) return;
      applyMutation(ctx, (node) => {
        const layout = node as JsonSlideLayout;
        if (layout.type !== 'bentoGrid') {
          return layout;
        }
        return {
          ...(layout as JsonSlideBentoLayout),
          rows: value,
        };
      });
    },
    updateSplitSpans(value) {
      // Инвариант геометрии splitLayout: оба span — целые 1..11 и в сумме
      // дают 12 (контракт парсера `parseRegionLayout`). `left` —
      // источник правды, `right` всегда выводится как `12 - left`, чтобы
      // неконсистентная пара физически не могла попасть в документ.
      // Невалидный `left` → честный no-op (см. Key Design Rule плана:
      // лучше не коммитить, чем писать битую геометрию).
      const { left } = value;
      if (!Number.isInteger(left) || left < 1 || left > 11) return;
      const right = 12 - left;
      applyMutation(ctx, (node) => {
        const layout = node as JsonSlideLayout;
        if (layout.type !== 'splitLayout') {
          return layout;
        }
        const next: JsonSlideSplitLayout = {
          ...(layout as JsonSlideSplitLayout),
          leftSpan: left,
          rightSpan: right,
        };
        return next;
      });
    },
  };
}

// --- stack -----------------------------------------------------------------

export function createStackActions(ctx: NodeActionFactoryContext): StackActions {
  return {
    updateAlign(value) {
      applyMutation(ctx, (node) => ({
        ...(node as JsonSlideTextStack),
        align: value,
      }));
    },
    updateJustify(value) {
      applyMutation(ctx, (node) => ({
        ...(node as JsonSlideTextStack),
        justify: value,
      }));
    },
    updateGap(value) {
      applyMutation(ctx, (node) =>
        patchOptionalField(node as JsonSlideTextStack, 'gap', value ?? undefined),
      );
    },
  };
}

// --- image cover · background ---------------------------------------------

export function createImageCoverBackgroundActions(
  ctx: NodeActionFactoryContext,
): ImageCoverBackgroundActions {
  return {
    updateSrc(url, meta) {
      applyMutation(ctx, (node) => {
        const next: JsonImageCoverBackground = {
          ...(node as JsonImageCoverBackground),
          src: url,
        };
        if (meta?.alt && (next.alt === undefined || next.alt === '')) {
          next.alt = meta.alt;
        }
        return next;
      });
    },
    updateAlt(value) {
      const cleared = value === null || value === '' ? undefined : value;
      applyMutation(ctx, (node) =>
        patchOptionalField(node as JsonImageCoverBackground, 'alt', cleared),
      );
    },
    updateOverlay(value) {
      applyMutation(ctx, (node) => ({
        ...(node as JsonImageCoverBackground),
        overlay: value,
      }));
    },
  };
}

// --- image cover · headline -----------------------------------------------

export function createImageCoverHeadlineActions(
  ctx: NodeActionFactoryContext,
): ImageCoverHeadlineActions {
  return {
    updateStack(value) {
      applyMutation(ctx, (node) => ({
        ...(node as JsonImageCoverHeadline),
        stack: value,
      }));
    },
    updateOffsetYPx(value) {
      applyMutation(ctx, (node) => ({
        ...(node as JsonImageCoverHeadline),
        offsetYPx: value,
      }));
    },
  };
}

// --- image cover · rail item ----------------------------------------------

type RailText = Extract<JsonImageCoverRailItem, { kind: 'text' }>;
type RailCluster = Extract<JsonImageCoverRailItem, { kind: 'cluster' }>;

export function createImageCoverRailItemActions(
  ctx: NodeActionFactoryContext,
): ImageCoverRailItemActions {
  return {
    updateTextStyle(value) {
      applyMutation(ctx, (node) => {
        const item = node as JsonImageCoverRailItem;
        if (item.kind !== 'text') return item;
        const next: RailText = { ...(item as RailText), style: value };
        return next;
      });
    },
    updateTextAlign(value) {
      applyMutation(ctx, (node) => {
        const item = node as JsonImageCoverRailItem;
        if (item.kind !== 'text') return item;
        const next: RailText = { ...(item as RailText), textAlign: value };
        return next;
      });
    },
    updateClusterGap(value) {
      applyMutation(ctx, (node) => {
        const item = node as JsonImageCoverRailItem;
        if (item.kind !== 'cluster') return item;
        const next: RailCluster = { ...(item as RailCluster), gap: value };
        return next;
      });
    },
  };
}

// `applyReplace` экспортируется для будущих фабрик (полная замена узла).
// Сейчас не используется, но завязан на единый коммит — оставлен как
// внутренний строительный блок.
void applyReplace;
