/**
 * Фабрика slide-level semantic actions для `SlideInspector` (этап 6 плана
 * `creator-semantic-mutations`).
 *
 * В отличие от `nodeActions.ts`, slide-actions не работают по node-path:
 *   - `updateTitle` / `updateSpeakerNotes` идут через `store.updateSlideMeta`
 *     (это не часть `JsonSlideDocument`, а meta слайда в репозитории);
 *   - `updateTheme` правит корневой `theme` документа;
 *   - `updateFrame` / `updateContent` / `updateBackdrop` иммутабельно
 *     обновляют соответствующий wrapper в документе. Вся ветка «правка
 *     допустима только для default/textStack» спрятана здесь — UI просто
 *     зовёт action, фабрика молча игнорирует, если шаблон другой.
 *
 * Стор передаётся через узкий inline-тип, чтобы не таскать весь
 * `EditorStore` в фабрику (см. контракт `StoreLike` ниже).
 */

import type {
  JsonSlideBackdrop,
  JsonSlideContent,
  JsonSlideDocument,
  JsonSlideFrame,
} from '../../../presentation/jsonSlideTypes';
import { isJsonSlideWrapperDocument } from '../../../presentation/jsonSlideTypes';
import type { SlideTheme } from '../../../presentation/types';
import type { SlideActions } from './actionTypes';

/**
 * Узкий контракт стора для slide-actions: только то, что реально нужно
 * фабрике. Совпадает с подмножеством `EditorStore` в `editorStore.tsx`.
 */
export interface SlideActionsStore {
  updateSlideMeta: (
    slideId: string,
    patch: { title?: string | null; speakerNotes?: string | null },
  ) => Promise<void>;
  updateSlideDocument: (slideId: string, document: unknown) => void;
}

export interface SlideActionsContext {
  slideId: string;
  doc: JsonSlideDocument;
  store: SlideActionsStore;
}

/**
 * Иммутабельно обновляет один из wrapper-ключей документа (`frame`,
 * `content`, `backdrop`), повторяя логику прежнего `SlideInspector.patchWrapper`:
 *   - если шаблон документа не поддерживает обёртки — no-op;
 *   - mutator получает «текущее» значение (если ключа нет — пустой объект);
 *   - если mutator вернул `null` или пустой объект — ключ удаляется;
 *   - иначе — записывается результат.
 */
function updateWrapper<K extends 'frame' | 'content' | 'backdrop', T extends object>(
  ctx: SlideActionsContext,
  key: K,
  mutator: (current: T) => T | null,
): void {
  if (!isJsonSlideWrapperDocument(ctx.doc)) return;
  const draft = { ...ctx.doc } as Record<string, unknown>;
  const current = ((draft[key] as T | undefined) ?? ({} as T));
  const updated = mutator({ ...(current as object) } as T);
  if (updated === null || Object.keys(updated as object).length === 0) {
    delete draft[key];
  } else {
    draft[key] = updated;
  }
  ctx.store.updateSlideDocument(ctx.slideId, draft as unknown as JsonSlideDocument);
}

export function createSlideActions(ctx: SlideActionsContext): SlideActions {
  return {
    updateTitle(value) {
      void ctx.store.updateSlideMeta(ctx.slideId, { title: value });
    },
    updateSpeakerNotes(value) {
      void ctx.store.updateSlideMeta(ctx.slideId, { speakerNotes: value });
    },
    updateTheme(value) {
      const next = { ...ctx.doc } as JsonSlideDocument;
      if (value === null) {
        delete (next as { theme?: SlideTheme }).theme;
      } else {
        (next as { theme?: SlideTheme }).theme = value;
      }
      ctx.store.updateSlideDocument(ctx.slideId, next);
    },
    updateFrame(mutator) {
      updateWrapper<'frame', JsonSlideFrame>(ctx, 'frame', mutator);
    },
    updateContent(mutator) {
      updateWrapper<'content', JsonSlideContent>(ctx, 'content', mutator);
    },
    updateBackdrop(mutator) {
      updateWrapper<'backdrop', JsonSlideBackdrop>(ctx, 'backdrop', mutator);
    },
  };
}
