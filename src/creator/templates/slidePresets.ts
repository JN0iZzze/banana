/**
 * Стартовые пресеты для нового слайда.
 * Каждая фабрика возвращает уже валидный `JsonSlideDocument` своего шаблона —
 * proves itself через `parseJsonSlideDocument` в creator-валидации.
 *
 * Эта зона намеренно отделена от `validateSlideDocument.createEmptySlideDocument`,
 * чтобы валидатор не превращался в свалку шаблонов.
 */

import type {
  JsonSlideDefaultDocument,
  JsonSlideDocument,
  JsonSlideImageCoverDocument,
  JsonSlideTextStackDocument,
} from '../../presentation/jsonSlideTypes';

export type SlidePresetId =
  | 'textStackTitle'
  | 'defaultSplit'
  | 'defaultTwoColumns'
  | 'defaultGrid'
  | 'imageCover';

export interface SlidePreset {
  id: SlidePresetId;
  /** Человекочитаемое название для UI. */
  title: string;
  /** Краткое описание формата. */
  description: string;
  /** Фабрика стартового документа. */
  build: () => JsonSlideDocument;
}

function buildTextStackTitle(): JsonSlideTextStackDocument {
  return {
    template: 'textStack',
    stack: {
      align: 'left',
      justify: 'center',
      items: [
        { type: 'text', variant: 'h1', size: 'display', text: 'Заголовок' },
        { type: 'text', variant: 'lead', text: 'Подзаголовок' },
      ],
    },
  };
}

function buildDefaultSplit(): JsonSlideDefaultDocument {
  return {
    template: 'default',
    header: { meta: 'Раздел' },
    layout: {
      type: 'splitLayout',
      gap: 'md',
      leftSpan: 5,
      rightSpan: 7,
      left: {
        kind: 'text',
        text: {
          items: [{ variant: 'h2', text: 'Левая колонка' }],
        },
      },
      right: {
        kind: 'text',
        text: {
          items: [{ variant: 'body', text: 'Правая колонка' }],
        },
      },
    },
  };
}

function buildDefaultTwoColumns(): JsonSlideDefaultDocument {
  return {
    template: 'default',
    header: { meta: 'Раздел' },
    layout: {
      type: 'equalColumns',
      gap: 'md',
      items: [
        {
          span: 6,
          region: {
            kind: 'text',
            text: { items: [{ variant: 'body', text: 'Колонка 1' }] },
          },
        },
        {
          span: 6,
          region: {
            kind: 'text',
            text: { items: [{ variant: 'body', text: 'Колонка 2' }] },
          },
        },
      ],
    },
  };
}

function buildDefaultGrid(): JsonSlideDefaultDocument {
  return {
    template: 'default',
    header: { meta: 'Раздел' },
    layout: {
      type: 'uniformGrid',
      columns: 3,
      gap: 'md',
      items: [
        { tone: 'standard', items: [{ variant: 'h3', text: 'Карточка 1' }] },
        { tone: 'standard', items: [{ variant: 'h3', text: 'Карточка 2' }] },
        { tone: 'standard', items: [{ variant: 'h3', text: 'Карточка 3' }] },
      ],
    },
  };
}

function buildImageCover(): JsonSlideImageCoverDocument {
  return {
    template: 'imageCover',
    cover: {
      background: { src: '', overlay: 'none' },
      frame: true,
      topRail: {
        variant: 'two',
        items: [
          { kind: 'text', lines: ['—'] },
          { kind: 'text', lines: ['—'] },
        ],
      },
      headline: {
        align: 'center',
        offsetYPx: 220,
        stack: 'br',
        blocks: [
          { text: 'Заголовок обложки', font: 'display', size: 'mega', color: 'white' },
        ],
      },
      bottomRail: {
        variant: 'three',
        items: [
          { kind: 'text', lines: ['—'] },
          { kind: 'text', lines: ['—'] },
          { kind: 'text', lines: ['—'] },
        ],
      },
    },
  };
}

export const SLIDE_PRESETS: readonly SlidePreset[] = [
  {
    id: 'textStackTitle',
    title: 'Титульный (textStack)',
    description: 'Заголовок + подзаголовок, без header/layout.',
    build: buildTextStackTitle,
  },
  {
    id: 'defaultSplit',
    title: 'Два блока (splitLayout)',
    description: 'Header + горизонтальный сплит с двумя текстовыми регионами.',
    build: buildDefaultSplit,
  },
  {
    id: 'defaultTwoColumns',
    title: 'Две колонки (equalColumns)',
    description: 'Header + два равных текстовых столбца.',
    build: buildDefaultTwoColumns,
  },
  {
    id: 'defaultGrid',
    title: 'Сетка карточек (uniformGrid)',
    description: 'Header + три карточки в одну строку.',
    build: buildDefaultGrid,
  },
  {
    id: 'imageCover',
    title: 'Обложка с фото (imageCover)',
    description: 'Полноэкранная картинка, рельсы сверху/снизу и большой заголовок.',
    build: buildImageCover,
  },
];

export function findSlidePreset(id: SlidePresetId): SlidePreset | null {
  return SLIDE_PRESETS.find((p) => p.id === id) ?? null;
}
