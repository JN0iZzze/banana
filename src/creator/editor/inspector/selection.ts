/**
 * Селект-модель инспектора Creator.
 *
 * Описывает, ЧТО сейчас выделено в правой панели редактора:
 * - `slide` (по умолчанию) — показываем общий `SlideInspector` (метаданные слайда).
 * - `node`  — показываем `NodeInspector` для конкретного узла документа,
 *             идентифицированного абсолютным dot-path от корня `JsonSlideDocument`
 *             (как в `EditableBinding.path` из `collectEditablePaths.ts`).
 *
 * Эта модель НЕ связана с `editingPath` из `EditorModeContext` — там идёт речь
 * про активную inline-правку текста на сцене. Selection — независимая ось,
 * которая управляет содержимым правой панели и переживает фокус-блюр инпутов.
 */

export type InspectorSelectionKind =
  | 'header'
  | 'card'
  | 'quote'
  | 'textRegion'
  | 'layout'
  | 'stack'
  | 'mediaGallery'
  | 'mediaItem'
  | 'imageCoverHeadline'
  | 'imageCoverRail'
  | 'imageCoverBackground';

export type InspectorSelection =
  | { scope: 'slide' }
  | { scope: 'node'; path: string; kind: InspectorSelectionKind };

/** Дефолтное selection: показываем инспектор слайда целиком. */
export const SLIDE_SELECTION: InspectorSelection = { scope: 'slide' };
