/**
 * Реестр инспекторов узлов: `InspectorSelectionKind` → React-компонент.
 *
 * Подключается к `NodeInspector` (Этап 4 рефакторинга): по `selection.kind`
 * вытаскиваем готовый компонент и рендерим его с пропсами `NodeInspectorProps`.
 *
 * Здесь — только map + lookup. Никаких бизнес-правил, ни обработки patch'ей,
 * ни template-routing. Конкретные kind-инспекторы (`HeaderInspector`,
 * `CardInspector` и т.д.) регистрируются в `registry.defaults.ts` (Этап 5
 * наполнит этот файл реальными компонентами).
 */
import type React from 'react';
import type { JsonSlideDocument } from '../../../presentation/jsonSlideTypes';
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
} from '../mutations/actionTypes';
import type { InspectorSelection, InspectorSelectionKind } from './selection';

/**
 * Discriminated union actions-фасада для kind-инспектора.
 *
 * Тег `kind` совпадает с `InspectorSelectionKind` — `NodeInspector`
 * собирает экземпляр на основе текущего `selection.kind`, а компонент
 * из реестра делает narrow по `actions.kind` и пользуется доменными
 * операциями соответствующего интерфейса.
 *
 * Для `mediaGallery` / `mediaItem` action API пока не описан (волна 2):
 * варианты присутствуют без полей, чтобы union покрывал весь
 * `InspectorSelectionKind` и `NodeInspector` мог гарантированно
 * передать `actions` для любого селекшена.
 */
export type NodeKindActions =
  | { kind: 'header'; header: HeaderActions }
  | { kind: 'card'; card: CardActions }
  | { kind: 'quote'; quote: QuoteActions }
  | { kind: 'textRegion'; textRegion: TextRegionActions }
  | { kind: 'layout'; layout: LayoutActions }
  | { kind: 'stack'; stack: StackActions }
  | { kind: 'imageCoverBackground'; imageCoverBackground: ImageCoverBackgroundActions }
  | { kind: 'imageCoverHeadline'; imageCoverHeadline: ImageCoverHeadlineActions }
  | { kind: 'imageCoverRail'; imageCoverRail: ImageCoverRailItemActions }
  | { kind: 'mediaGallery' }
  | { kind: 'mediaItem' };

/**
 * Пропсы, которые `NodeInspector` пробрасывает в kind-компонент из реестра.
 */
export interface NodeInspectorProps {
  /** Текущий node-selection: гарантированно `scope === 'node'`. */
  selection: Extract<InspectorSelection, { scope: 'node' }>;
  /** Текущий валидный документ слайда. */
  doc: JsonSlideDocument;
  /**
   * Semantic action API для текущего kind. `actions.kind` гарантированно
   * совпадает с `selection.kind` — компонент должен делать narrow по
   * `actions.kind` и обращаться к соответствующему вложенному фасаду
   * (`actions.header`, `actions.card`, …).
   */
  actions: NodeKindActions;
}

/** React-компонент, рендерящий инспектор для конкретного `kind`. */
export type NodeInspectorComponent = React.ComponentType<NodeInspectorProps>;

/**
 * Минимальный интерфейс реестра: lookup по `kind`. Возвращает `null`, если
 * для kind ещё не зарегистрирован компонент (это валидная ситуация — fallback
 * рисует сам `NodeInspector`).
 */
export interface InspectorRegistry {
  get(kind: InspectorSelectionKind): NodeInspectorComponent | null;
}

/**
 * Создаёт реестр из частичной мапы `kind → компонент`. Не делает ни валидации,
 * ни автозагрузки — что в map, то и доступно через `get`.
 */
export function createInspectorRegistry(
  map: Partial<Record<InspectorSelectionKind, NodeInspectorComponent>>,
): InspectorRegistry {
  return {
    get(kind) {
      return map[kind] ?? null;
    },
  };
}
