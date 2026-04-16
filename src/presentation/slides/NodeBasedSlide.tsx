import type { SlideRenderProps } from '../types';
import { formatSlideMeta } from '../slideMeta';
import {
  Reveal,
  SlideAssetImage,
  SlideBackdrop,
  SlideColumn,
  SlideContent,
  SlideFrame,
  SlideGrid,
  SlideHeader,
  Text,
} from '../../ui/slides';

const NODES = [
  { src: '/images/nodes/freepik.png', name: 'Freepik Spaces' },
  { src: '/images/nodes/krea.png', name: 'Krea Nodes' },
  { src: '/images/nodes/weavy.png', name: 'Weavy.ai' },
] as const;

export function NodeBasedSlide({ index, totalSlides }: SlideRenderProps) {
  return (
    <SlideFrame padding="compact">
      <SlideBackdrop variant="grid" accent="primary" />

      <SlideContent width="wide" density="compact" className="h-full min-h-0 justify-between">
        <SlideHeader
          align="center"
          className="max-w-[1720px] shrink-0 gap-4"
          meta={
            <Text variant="meta" className="text-center">
              {formatSlideMeta('Нодовые системы', index, totalSlides)}
            </Text>
          }
        >
          <Reveal preset="soft" delay={0.1}>
            <Text variant="h1" size="section" className="text-center">
              Нодовые системы
            </Text>
          </Reveal>
        </SlideHeader>

        <SlideGrid columns={12} gap="md" className="min-h-0 flex-1 auto-rows-fr items-stretch">
          {NODES.map((node, nodeIndex) => (
            <SlideColumn key={node.name} span={4} className="min-h-0">
              <Reveal preset="soft" delay={0.18 + nodeIndex * 0.1} className="flex h-full min-h-0 flex-col">
                <div className="flex h-full min-h-0 flex-col items-center gap-[var(--slide-stack-gap-md)]">
                  <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-[var(--slide-radius-panel)]">
                    <SlideAssetImage src={node.src} objectAlign="center" />
                  </div>
                  <Text variant="overline" className="text-center tracking-[0.35em]">
                    {node.name}
                  </Text>
                </div>
              </Reveal>
            </SlideColumn>
          ))}
        </SlideGrid>
      </SlideContent>
    </SlideFrame>
  );
}
