/**
 * Slide ids для вайбкодинг-деки (`/vibecoding`).
 *
 * Сценарий — `vibecoding-deck-plan.md`. Legacy-ключи прежней версии лежат в
 * `./vibecoding/archive/legacyVibecodingSlideIds.ts` (`VIBECODING_LEGACY_SLIDE_IDS`).
 * Префикс `v2` отделяет новые id от архивных (`vibecoding-01-cover` и т.д.).
 */
export const VIBECODING_DECK_SLIDE_IDS = {
  cover: 'vibecoding-v2-01-cover',
  pastTeam: 'vibecoding-v2-02-past-team',
  nowSoloAi: 'vibecoding-v2-03-now-solo-ai',
  shiftIsReal: 'vibecoding-v2-04-shift-is-real',
  booster: 'vibecoding-v2-05-booster',
  hero: 'vibecoding-v2-06-hero',
  threeFears: 'vibecoding-v2-07-three-fears',
  act2Separator: 'vibecoding-v2-08-act2-separator',
  landscape: 'vibecoding-v2-09-landscape',
  sandboxes: 'vibecoding-v2-10-sandboxes',
  proTransition: 'vibecoding-v2-11-pro-transition',
  agentVsChat: 'vibecoding-v2-12-agent-vs-chat',
  cursorVsClaude: 'vibecoding-v2-13-cursor-vs-claude',
} as const;
