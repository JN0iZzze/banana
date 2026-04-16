import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DeckDefinition, SlideDefinition } from '../types';

function clampIndex(index: number, totalSlides: number) {
  if (totalSlides <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), totalSlides - 1);
}

function visibleSlidesFromDeck(deck: DeckDefinition): SlideDefinition[] {
  return deck.slides.filter((slide) => !slide.hidden);
}

export function usePresentationDeck(deck: DeckDefinition) {
  const visibleSlides = useMemo(() => visibleSlidesFromDeck(deck), [deck]);

  const initialVisibleIndex = useMemo(() => {
    const totalVisible = visibleSlides.length;
    if (totalVisible <= 0) {
      return 0;
    }

    if (!deck.defaultSlideId) {
      return 0;
    }

    const configuredSlide = deck.slides.find((slide) => slide.id === deck.defaultSlideId);
    if (!configuredSlide || configuredSlide.hidden) {
      return 0;
    }

    const visibleIndex = visibleSlides.findIndex((slide) => slide.id === configuredSlide.id);
    return visibleIndex >= 0 ? visibleIndex : 0;
  }, [deck.defaultSlideId, deck.slides, visibleSlides]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialVisibleIndex);

  useEffect(() => {
    setCurrentSlideIndex(initialVisibleIndex);
  }, [initialVisibleIndex]);

  const totalSlides = visibleSlides.length;
  const currentSlide = visibleSlides[clampIndex(currentSlideIndex, totalSlides)];

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((index) => clampIndex(index + 1, totalSlides));
  }, [totalSlides]);

  const previousSlide = useCallback(() => {
    setCurrentSlideIndex((index) => clampIndex(index - 1, totalSlides));
  }, [totalSlides]);

  const goToSlide = useCallback(
    (visibleIndex: number) => {
      setCurrentSlideIndex(clampIndex(visibleIndex, totalSlides));
    },
    [totalSlides],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'ArrowRight' ||
        event.key === ' ' ||
        event.key === 'Enter' ||
        event.key === 'PageDown'
      ) {
        nextSlide();
      }

      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        previousSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, previousSlide]);

  return {
    slides: visibleSlides,
    totalSlides,
    currentSlide,
    currentSlideIndex,
    nextSlide,
    previousSlide,
    goToSlide,
    isFirst: currentSlideIndex === 0,
    isLast: totalSlides > 0 && currentSlideIndex === totalSlides - 1,
  };
}
