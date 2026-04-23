import { parseJsonSlideDocument } from '../../presentation/jsonSlideSchema';
import type { JsonSlideTextStackDocument } from '../../presentation/jsonSlideTypes';
import type { SlideTheme } from '../../presentation/types';
import type { CreatorValidation } from '../domain/types';

export function validateSlideDocument(raw: unknown): CreatorValidation {
  const result = parseJsonSlideDocument(raw);
  if (result.ok) {
    return { status: 'valid', doc: result.doc };
  }
  return { status: 'invalid', error: result.error };
}

/**
 * Minimal valid JSON slide: textStack template with a single h1/display line.
 * Kept minimal to avoid header/layout/frame plumbing on fresh slides.
 */
export function createEmptySlideDocument(theme?: SlideTheme): JsonSlideTextStackDocument {
  const doc: JsonSlideTextStackDocument = {
    template: 'textStack',
    stack: {
      align: 'left',
      justify: 'start',
      items: [
        {
          type: 'text',
          variant: 'h1',
          size: 'display',
          text: 'Новый слайд',
        },
      ],
    },
  };
  if (theme !== undefined) {
    doc.theme = theme;
  }
  return doc;
}
