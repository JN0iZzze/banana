import { defineJsonSlide } from '../../defineJsonSlide';
import { VIBECODING_LEGACY_SLIDE_IDS as VIBECODING_DECK_SLIDE_IDS } from './legacyVibecodingSlideIds';
import rawVibecoding01Cover from './schemas/slide-vibecoding-01-cover.json';
import rawVibecoding02Definition from './schemas/slide-vibecoding-02-definition.json';
import rawVibecoding03Refusal from './schemas/slide-vibecoding-03-refusal.json';
import rawVibecoding04Cycle from './schemas/slide-vibecoding-04-cycle.json';
import rawVibecoding05Landscape from './schemas/slide-vibecoding-05-landscape.json';
import rawVibecoding06Platforms from './schemas/slide-vibecoding-06-platforms.json';
import rawVibecoding07Philosophies from './schemas/slide-vibecoding-07-philosophies.json';
import rawVibecoding08ProTools from './schemas/slide-vibecoding-08-pro-tools.json';
import rawVibecoding09CursorVsClaude from './schemas/slide-vibecoding-09-cursor-vs-claude.json';
import rawVibecoding10DoomLoop from './schemas/slide-vibecoding-10-doom-loop.json';
import rawVibecoding11CostOfReliability from './schemas/slide-vibecoding-11-cost-of-reliability.json';
import rawVibecoding12Architecture from './schemas/slide-vibecoding-12-architecture.json';
import rawVibecoding13Rules from './schemas/slide-vibecoding-13-rules.json';
import rawVibecoding14Mcp from './schemas/slide-vibecoding-14-mcp.json';
import rawVibecoding15Subagents from './schemas/slide-vibecoding-15-subagents.json';
import rawVibecoding16Security from './schemas/slide-vibecoding-16-security.json';
import rawVibecoding17Closing from './schemas/slide-vibecoding-17-closing.json';
import rawVibecoding18Demo from './schemas/slide-vibecoding-18-demo.json';

const sid = VIBECODING_DECK_SLIDE_IDS;

/**
 * Legacy вайбкодинг-деки (18 слайдов, до рестарта сценария в апреле 2026).
 * Не импортируется `vibecodingDeck` — доступен здесь для справки и при необходимости
 * вернуть отдельные слайды в новую композицию.
 */
export const vibecodingLegacyJsonSlides = [
  defineJsonSlide({
    id: sid.cover,
    title: 'Вайбкодинг',
    theme: 'editorial',
    raw: rawVibecoding01Cover,
    source: 'slide-vibecoding-01-cover.json',
    notes: 'Акт I · Пролог. История одной трансформации — от идеи до задеплоенного продукта.',
  }),
  defineJsonSlide({
    id: sid.definition,
    title: 'Обычный мир',
    theme: 'editorial',
    raw: rawVibecoding02Definition,
    source: 'slide-vibecoding-02-definition.json',
    notes: 'Акт I · Обычный мир и зов. Фрустрация «идея есть — рук нет», момент освобождения (Масад).',
  }),
  defineJsonSlide({
    id: sid.refusal,
    title: 'Отказ от зова',
    theme: 'editorial',
    raw: rawVibecoding03Refusal,
    source: 'slide-vibecoding-03-refusal.json',
    notes: 'Акт I · Отказ от зова. Три страха на пороге: интеллектуальный, самозванец, техскепсис.',
  }),
  defineJsonSlide({
    id: sid.cycle,
    title: 'Встреча с наставником',
    theme: 'editorial',
    raw: rawVibecoding04Cycle,
    source: 'slide-vibecoding-04-cycle.json',
    notes: 'Акт I · Наставник и переход порога. Первый промпт — барьер между идеей и реальностью рушится.',
  }),
  defineJsonSlide({
    id: sid.landscape,
    title: 'Мир приключений',
    theme: 'editorial',
    raw: rawVibecoding05Landscape,
    source: 'slide-vibecoding-05-landscape.json',
    notes: 'Акт II · Мир приключений. Карта дорог вайбкодинга 2026 — пять категорий.',
  }),
  defineJsonSlide({
    id: sid.platforms,
    title: 'Проводники',
    theme: 'editorial',
    raw: rawVibecoding06Platforms,
    source: 'slide-vibecoding-06-platforms.json',
    notes: 'Акт II · Проводники. Replit, Lovable, Bolt — три ставки для новичка.',
  }),
  defineJsonSlide({
    id: sid.philosophies,
    title: 'Развилка',
    theme: 'editorial',
    raw: rawVibecoding07Philosophies,
    source: 'slide-vibecoding-07-philosophies.json',
    notes: 'Акт II · Развилка. Закрытая платформа против открытой разработки — две тропы.',
  }),
  defineJsonSlide({
    id: sid.proTools,
    title: 'Оружие мастера',
    theme: 'editorial',
    raw: rawVibecoding08ProTools,
    source: 'slide-vibecoding-08-pro-tools.json',
    notes: 'Акт II · Оружие мастера. Cursor и Claude Code — индустриальный стандарт pro-уровня.',
  }),
  defineJsonSlide({
    id: sid.cursorVsClaude,
    title: 'Два наставника',
    theme: 'editorial',
    raw: rawVibecoding09CursorVsClaude,
    source: 'slide-vibecoding-09-cursor-vs-claude.json',
    notes: 'Акт II · Два наставника. Характеры Cursor и Claude Code — выбор зависит от того, кем ты становишься.',
  }),
  defineJsonSlide({
    id: sid.doomLoop,
    title: 'Главное испытание',
    theme: 'editorial',
    raw: rawVibecoding10DoomLoop,
    source: 'slide-vibecoding-10-doom-loop.json',
    notes: 'Акт III · Главное испытание. Трёхголовый дракон: техдолг, когнитивный долг, архитектурная энтропия.',
  }),
  defineJsonSlide({
    id: sid.costOfReliability,
    title: 'Цена надёжности',
    theme: 'editorial',
    raw: rawVibecoding11CostOfReliability,
    source: 'slide-vibecoding-11-cost-of-reliability.json',
    notes: 'Акт III · Цена надёжности. ×2–4, когнитивный долг, от Accept All к критическому ревью.',
  }),
  defineJsonSlide({
    id: sid.architecture,
    title: 'Артефакт силы I',
    theme: 'editorial',
    raw: rawVibecoding12Architecture,
    source: 'slide-vibecoding-12-architecture.json',
    notes: 'Акт III · Артефакт силы I — архитектура. Слои Data/Controller/View как границы против энтропии.',
  }),
  defineJsonSlide({
    id: sid.rules,
    title: 'Артефакт силы II',
    theme: 'editorial',
    raw: rawVibecoding13Rules,
    source: 'slide-vibecoding-13-rules.json',
    notes: 'Акт III · Артефакт силы II — правила. CLAUDE.md, .cursorrules, AGENTS.md как постоянный контекст.',
  }),
  defineJsonSlide({
    id: sid.mcp,
    title: 'Артефакт силы III',
    theme: 'editorial',
    raw: rawVibecoding14Mcp,
    source: 'slide-vibecoding-14-mcp.json',
    notes: 'Акт III · Артефакт силы III — MCP. Чувства агента во внешнем мире: БД, доки, SDK.',
  }),
  defineJsonSlide({
    id: sid.subagents,
    title: 'Артефакт силы IV',
    theme: 'editorial',
    raw: rawVibecoding15Subagents,
    source: 'slide-vibecoding-15-subagents.json',
    notes: 'Акт III · Артефакт силы IV — субагенты. Союзники-делегаты: тесты, доки, ревью параллельно.',
  }),
  defineJsonSlide({
    id: sid.security,
    title: 'Последний удар',
    theme: 'editorial',
    raw: rawVibecoding16Security,
    source: 'slide-vibecoding-16-security.json',
    notes: 'Акт III · Последний удар испытания. 70% уязвимых: RLS, вебхуки, инъекции — цена игнора hardening.',
  }),
  defineJsonSlide({
    id: sid.closing,
    title: 'Возвращение с эликсиром',
    theme: 'editorial',
    raw: rawVibecoding17Closing,
    source: 'slide-vibecoding-17-closing.json',
    notes: 'Акт III · Возвращение с эликсиром. Дизайнер-директор систем — идеи в продукт за недели.',
  }),
  defineJsonSlide({
    id: sid.demo,
    title: 'Демо: старт',
    theme: 'editorial',
    raw: rawVibecoding18Demo,
    source: 'slide-vibecoding-18-demo.json',
    hidden: true,
    notes: 'Старая заготовка; оставлена скрытой для совместимости.',
  }),
];
