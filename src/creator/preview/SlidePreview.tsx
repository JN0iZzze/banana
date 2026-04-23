import { useLayoutEffect, useRef, useState } from 'react';
import { toJsonSlideDefinition } from '../adapters/toDeckDefinition';
import type { CreatorSlide } from '../domain/types';
import { STAGE_HEIGHT, STAGE_WIDTH } from '../../presentation/hooks/useStageScale';
import { themeClassNames } from '../../ui/slides/themePresets';
import { cn } from '../../ui/slides/cn';
import { EditorModeProvider } from '../inline-edit/EditorModeProvider';
import { useEditorStore } from '../editor/editorStore';

interface SlidePreviewProps {
  slide: CreatorSlide | null;
}

/**
 * Живой превью активного слайда. Берёт валидированный JsonSlideDefinition
 * через toJsonSlideDefinition, рендерит компонентом слайда и фитит в контейнер
 * через CSS `transform: scale(k)`. Нативный размер сцены — 1920×1080
 * (см. STAGE_WIDTH / STAGE_HEIGHT в presentation/hooks/useStageScale).
 *
 * Центровка: сцену оборачиваем в «слот» с размерами `STAGE_W*k × STAGE_H*k`,
 * чтобы flex-центрирование работало корректно при `transformOrigin: top left`.
 */
export function SlidePreview({ slide }: SlidePreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const next = Math.min(rect.width / STAGE_WIDTH, rect.height / STAGE_HEIGHT);
      setScale(next > 0 ? next : 0);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const { updateSlideDocument } = useEditorStore();

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <PreviewBody slide={slide} scale={scale} onUpdateDocument={updateSlideDocument} />
    </div>
  );
}

function PreviewBody({
  slide,
  scale,
  onUpdateDocument,
}: {
  slide: CreatorSlide | null;
  scale: number;
  onUpdateDocument: (slideId: string, doc: unknown) => void;
}) {
  if (!slide) {
    return (
      <PreviewMessage>Выбери слайд слева — здесь появится его превью.</PreviewMessage>
    );
  }

  if (slide.validation.status === 'invalid') {
    return <PreviewErrorCard message={slide.validation.error} />;
  }

  const def = toJsonSlideDefinition(slide, 'editorial');
  if (!def) {
    return <PreviewErrorCard message="Не удалось собрать JsonSlideDefinition из документа." />;
  }

  if (scale <= 0) {
    // Первый кадр до первого измерения контейнера — не рендерим сцену,
    // чтобы не перегружать рендерер с неопределённым масштабом.
    return null;
  }

  const SlideComponent = def.component;

  return (
    <div
      // Слот с реальным визуальным размером после скейла — нужен flex-центровке.
      style={{
        width: STAGE_WIDTH * scale,
        height: STAGE_HEIGHT * scale,
      }}
    >
      <div
        className={cn(
          'overflow-hidden rounded-[var(--slide-radius-stage)] bg-[color:var(--slide-color-bg)] text-[color:var(--slide-color-text)] shadow-[0_30px_80px_rgba(0,0,0,0.45)]',
          themeClassNames[def.theme],
        )}
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <main className="relative h-full w-full">
          <EditorModeProvider slide={slide} onUpdateDocument={onUpdateDocument}>
            <SlideComponent slide={def} index={0} totalSlides={1} />
          </EditorModeProvider>
        </main>
      </div>
    </div>
  );
}

function PreviewMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-900/40 px-6 py-10 text-center text-sm text-neutral-500">
      {children}
    </div>
  );
}

function PreviewErrorCard({ message }: { message: string }) {
  return (
    <div className="w-[min(520px,80%)] rounded-lg border border-red-900/60 bg-red-950/40 p-5 text-sm text-red-200">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-300/80">
        Слайд невалиден
      </div>
      <div className="whitespace-pre-wrap break-words font-mono text-[12px] leading-snug text-red-100/90">
        {message}
      </div>
    </div>
  );
}
