import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Maximize, Menu, Minimize } from 'lucide-react';
import type { DeckDefinition } from '../types';
import { useFullscreen } from '../hooks/useFullscreen';
import { STAGE_HEIGHT, STAGE_WIDTH, useStageScale } from '../hooks/useStageScale';
import { usePresentationDeck } from '../hooks/usePresentationDeck';
import { SlideSidebar } from './SlideSidebar';
import { cn } from '../../ui/slides/cn';
import { themeClassNames } from '../../ui/slides/themePresets';

interface PresentationShellProps {
  deck: DeckDefinition;
}

const controlButtonClass =
  'flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/20';

export function PresentationShell({ deck }: PresentationShellProps) {
  const {
    currentSlide,
    currentSlideIndex,
    goToSlide,
    isFirst,
    isLast,
    nextSlide,
    previousSlide,
    slides,
    totalSlides,
  } = usePresentationDeck(deck);
  const scale = useStageScale();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [chromeSuppressed, setChromeSuppressed] = useState(false);
  const hideControlsTimer = useRef<number | null>(null);

  const scheduleHideControls = () => {
    if (hideControlsTimer.current) {
      window.clearTimeout(hideControlsTimer.current);
    }
    hideControlsTimer.current = window.setTimeout(() => {
      setShowControls(false);
    }, 2200);
  };

  useEffect(() => {
    const revealControls = () => {
      setShowControls(true);
      scheduleHideControls();
    };

    revealControls();
    window.addEventListener('mousemove', revealControls);

    return () => {
      window.removeEventListener('mousemove', revealControls);

      if (hideControlsTimer.current) {
        window.clearTimeout(hideControlsTimer.current);
      }
    };
  }, []);

  const suppressChrome = () => {
    setChromeSuppressed(true);
    if (hideControlsTimer.current) {
      window.clearTimeout(hideControlsTimer.current);
      hideControlsTimer.current = null;
    }
    setShowControls(true);
    scheduleHideControls();
    setSidebarOpen(false);
  };

  const restoreChrome = () => {
    setChromeSuppressed(false);
    setShowControls(true);
    scheduleHideControls();
  };

  if (!currentSlide || totalSlides === 0) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#060606] text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-white/60">Нет видимых слайдов в deck</p>
      </div>
    );
  }

  const CurrentSlideComponent = currentSlide.component;
  const chromeVisible = showControls && !chromeSuppressed;
  const showUiVisible = showControls && chromeSuppressed;

  return (
    <div
      className={cn(
        'relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#060606] text-[color:var(--slide-color-text)]',
        themeClassNames[currentSlide.theme],
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.45))]" />

      <div
        className="relative shrink-0 overflow-hidden rounded-[var(--slide-radius-stage)] bg-[color:var(--slide-color-bg)] shadow-[0_50px_120px_rgba(0,0,0,0.45)] transition-colors duration-500"
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <main className="relative h-full w-full">
          <CurrentSlideComponent
            slide={currentSlide}
            index={currentSlideIndex}
            totalSlides={totalSlides}
          />
        </main>
      </div>

      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open slide list"
        className={cn(
          'absolute left-8 top-8 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/20',
          chromeVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <Menu size={22} />
      </button>

      {chromeSuppressed ? (
        <button
          type="button"
          onClick={restoreChrome}
          aria-label="Show UI"
          className={cn(
            'absolute right-8 top-8 z-30 transition-opacity duration-300',
            controlButtonClass,
            showUiVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <Eye size={22} />
        </button>
      ) : (
        <div className="absolute right-8 top-8 z-30 flex flex-row items-center gap-3">
          <button
            type="button"
            onClick={suppressChrome}
            aria-label="Hide UI"
            className={cn(controlButtonClass, chromeVisible ? 'opacity-100' : 'pointer-events-none opacity-0')}
          >
            <EyeOff size={22} />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className={cn(controlButtonClass, chromeVisible ? 'opacity-100' : 'pointer-events-none opacity-0')}
          >
            {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
          </button>
        </div>
      )}

      {!isFirst ? (
        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className={cn(
            'absolute left-8 top-1/2 z-30 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/20',
            chromeVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <ChevronLeft size={34} />
        </button>
      ) : null}

      {!isLast ? (
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className={cn(
            'absolute right-8 top-1/2 z-30 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/20',
            chromeVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <ChevronRight size={34} />
        </button>
      ) : null}

      <div
        className={cn(
          'absolute bottom-8 left-8 z-30 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-xl transition-opacity duration-300',
          chromeVisible ? 'opacity-90' : 'opacity-0',
        )}
      >
        {String(currentSlideIndex + 1).padStart(2, '0')}
        <span className="mx-2 opacity-40">/</span>
        {String(totalSlides).padStart(2, '0')}
      </div>

      <div
        className={cn(
          'absolute bottom-8 right-8 z-30 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-xl transition-opacity duration-300',
          chromeVisible ? 'opacity-90' : 'opacity-0',
        )}
      >
        {deck.title}
      </div>

      <SlideSidebar
        deckTitle={deck.title}
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={goToSlide}
      />
    </div>
  );
}
