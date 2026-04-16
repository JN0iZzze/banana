/** Строка для `SlideHeader` meta: короткая тема слайда и позиция в деке. */
export function formatSlideMeta(theme: string, index: number, totalSlides: number): string {
  return `${theme} · ${String(index + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
}
