import type { SlideDefinition } from '../types';
import { cn } from '../../ui/slides/cn';

interface SlideSidebarProps {
  deckTitle: string;
  slides: SlideDefinition[];
  currentSlideIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (index: number) => void;
}

export function SlideSidebar({
  deckTitle,
  slides,
  currentSlideIndex,
  isOpen,
  onClose,
  onSelect,
}: SlideSidebarProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 z-40 bg-black/40 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'absolute left-0 top-0 z-50 flex h-full w-[26rem] flex-col border-r border-white/10 bg-[#0f0f10]/95 px-7 py-8 text-white backdrop-blur-xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/45">Deck</p>
          <h2 className="font-display text-3xl leading-tight">{deckTitle}</h2>
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-2">
          {slides.map((slide, index) => {
            const isActive = index === currentSlideIndex;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  onSelect(index);
                  onClose();
                }}
                className={cn(
                  'rounded-[1.5rem] border px-5 py-4 text-left transition-all duration-200',
                  isActive
                    ? 'border-white/15 bg-white text-[#0f0f10] shadow-[0_18px_40px_rgba(255,255,255,0.18)]'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
                )}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.3em] opacity-55">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="mt-2 text-lg font-medium tracking-[-0.02em]">{slide.title}</div>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
