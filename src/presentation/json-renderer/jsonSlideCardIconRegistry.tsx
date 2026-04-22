import type { ComponentType } from 'react';
import ByteDance from '@lobehub/icons/es/ByteDance';
import ClaudeIcon from '@lobehub/icons/es/Claude';
import CursorIcon from '@lobehub/icons/es/Cursor';
import LovableIcon from '@lobehub/icons/es/Lovable';
import FigmaIcon from '@lobehub/icons/es/Figma';
import ReplitIcon from '@lobehub/icons/es/Replit';
import Flux from '@lobehub/icons/es/Flux';
import Gemini from '@lobehub/icons/es/Gemini';
import Grok from '@lobehub/icons/es/Grok';
import Midjourney from '@lobehub/icons/es/Midjourney';
import OpenAI from '@lobehub/icons/es/OpenAI';
import Volcengine from '@lobehub/icons/es/Volcengine';
import {
  BarChart3,
  Brain,
  Clapperboard,
  Globe,
  Image as ImageLucide,
  LayoutTemplate,
  Layers,
  Monitor,
  Palette,
  PenTool,
  Share2,
  Sparkles,
  Type,
  Video,
  Workflow,
  Zap,
} from 'lucide-react';
import type { JsonSlideCardIconId } from '../jsonSlideTypes';

export type JsonSlideCardIconComponent = ComponentType<{ size?: number; className?: string }>;

/** Maps JSON `leadingIcon` / `watermarkIcon` string ids to React icon components. */
export const JSON_SLIDE_CARD_ICON_REGISTRY: Record<JsonSlideCardIconId, JsonSlideCardIconComponent> = {
  gemini: Gemini,
  'byte-dance': ByteDance,
  flux: Flux,
  grok: Grok,
  midjourney: Midjourney,
  openai: OpenAI,
  volcengine: Volcengine,
  clapperboard: Clapperboard,
  workflow: Workflow,
  palette: Palette,
  video: Video,
  image: ImageLucide,
  'layout-template': LayoutTemplate,
  'pen-tool': PenTool,
  sparkles: Sparkles,
  'bar-chart-3': BarChart3,
  type: Type,
  layers: Layers,
  'share-2': Share2,
  zap: Zap,
  monitor: Monitor,
  globe: Globe,
  brain: Brain,
  cursor: CursorIcon,
  claude: ClaudeIcon,
  'claude-code': ClaudeIcon,
  replit: ReplitIcon,
  lovable: LovableIcon,
  figma: FigmaIcon,
};

export function getJsonSlideCardIcon(id: JsonSlideCardIconId): JsonSlideCardIconComponent {
  return JSON_SLIDE_CARD_ICON_REGISTRY[id];
}
