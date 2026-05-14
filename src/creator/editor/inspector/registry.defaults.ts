/**
 * Дефолтный реестр инспекторов узлов.
 *
 * Этап 5: подключена первая волна node-инспекторов. Регистрация ниже —
 * единственная точка, через которую `NodeInspector` узнаёт, чем отрисовать
 * выделенный объект. Не зарегистрированные kind'ы (`mediaGallery`, `mediaItem`)
 * остаются на fallback из `NodeInspector` — это валидно.
 */
import { CardInspector } from './inspectors/CardInspector';
import { HeaderInspector } from './inspectors/HeaderInspector';
import { ImageCoverInspector } from './inspectors/ImageCoverInspector';
import { LayoutInspector } from './inspectors/LayoutInspector';
import { QuoteInspector } from './inspectors/QuoteInspector';
import { StackInspector } from './inspectors/StackInspector';
import { TextRegionInspector } from './inspectors/TextRegionInspector';
import { createInspectorRegistry, type InspectorRegistry } from './registry';

export const defaultInspectorRegistry: InspectorRegistry = createInspectorRegistry({
  header: HeaderInspector,
  card: CardInspector,
  quote: QuoteInspector,
  textRegion: TextRegionInspector,
  layout: LayoutInspector,
  stack: StackInspector,
  imageCoverBackground: ImageCoverInspector,
  imageCoverHeadline: ImageCoverInspector,
  imageCoverRail: ImageCoverInspector,
  // mediaGallery / mediaItem — намеренно не зарегистрированы, fallback из
  // NodeInspector корректно покажет «не реализовано».
});
