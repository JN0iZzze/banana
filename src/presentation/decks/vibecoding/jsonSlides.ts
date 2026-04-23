import { defineJsonSlide } from '../defineJsonSlide';
import type { JsonSlideDefinition } from '../../types';
import { VIBECODING_DECK_SLIDE_IDS } from '../vibecodingSlideIds';

import rawCover from './schemas/slide-vibecoding-v2-01-cover.json';
import rawAboutMe from '../main/schemas/slide-about-me.json';
import rawWhy from './schemas/slide-vibecoding-v2-01b-why.json';
import rawPastTeam from './schemas/slide-vibecoding-v2-02-past-team.json';
import rawNowSoloAi from './schemas/slide-vibecoding-v2-03-now-solo-ai.json';
import rawShiftIsReal from './schemas/slide-vibecoding-v2-04-shift-is-real.json';
import rawBooster from './schemas/slide-vibecoding-v2-05-booster.json';
import rawFutureRole from './schemas/slide-vibecoding-v2-05b-future-role.json';
import rawOutcomes from './schemas/slide-vibecoding-v2-05c-outcomes.json';
import rawHero from './schemas/slide-vibecoding-v2-06-hero.json';
import rawThreeFears from './schemas/slide-vibecoding-v2-07-three-fears.json';
import rawAct2Separator from './schemas/slide-vibecoding-v2-08-act2-separator.json';
import rawLandscape from './schemas/slide-vibecoding-v2-09-landscape.json';
import rawSandboxes from './schemas/slide-vibecoding-v2-10-sandboxes.json';
import rawAgentVsChat from './schemas/slide-vibecoding-v2-11-agent-vs-chat.json';
import rawConstructorVsAgent from './schemas/slide-vibecoding-v2-12-constructor-vs-agent.json';
import rawCursorVsClaude from './schemas/slide-vibecoding-v2-13-cursor-vs-claude.json';
import rawPricing from './schemas/slide-vibecoding-v2-14-pricing.json';
import rawCursorForDesigners from './schemas/slide-vibecoding-v2-15-cursor-for-designers.json';
import rawClaudeIdeEntry from './schemas/slide-vibecoding-v2-16-claude-ide-entry.json';
import rawLocalSetup from './schemas/slide-vibecoding-v2-16b-local-setup.json';
import rawAct3Separator from './schemas/slide-vibecoding-v2-17-act3-separator.json';
import rawIterationsNotMagic from './schemas/slide-vibecoding-v2-18-iterations-not-magic.json';
import rawValleyOfDespair from './schemas/slide-vibecoding-v2-19-valley-of-despair.json';
import rawContextWindow from './schemas/slide-vibecoding-v2-19-context-window.json';
import rawSummarization from './schemas/slide-vibecoding-v2-20-summarization.json';
import rawContextDrift from './schemas/slide-vibecoding-v2-21-context-drift.json';
import rawMdMemory from './schemas/slide-vibecoding-v2-22-md-memory.json';
import rawAct4Separator from './schemas/slide-vibecoding-v2-23-act4-separator.json';
import rawRulesPredictable from './schemas/slide-vibecoding-v2-24-rules-predictable.json';
import rawRulesExample1 from './schemas/slide-vibecoding-v2-25-rules-example-1.json';
import rawRulesExample2 from './schemas/slide-vibecoding-v2-26-rules-example-2.json';
import rawSkills from './schemas/slide-vibecoding-v2-27-skills.json';
import rawSubagents from './schemas/slide-vibecoding-v2-28-subagents.json';
import rawAllySetup from './schemas/slide-vibecoding-v2-28b-ally-setup.json';
import rawMcp from './schemas/slide-vibecoding-v2-29-mcp.json';
import rawAgentModes from './schemas/slide-vibecoding-v2-29b-agent-modes.json';
import rawAct5Separator from './schemas/slide-vibecoding-v2-30-act5-separator.json';
import rawDoomLoop from './schemas/slide-vibecoding-v2-32-doom-loop.json';
import rawBasicsMatter from './schemas/slide-vibecoding-v2-33-basics-matter.json';
import rawCostOfReliability from './schemas/slide-vibecoding-v2-34-cost-of-reliability.json';
import rawSecurityHoles from './schemas/slide-vibecoding-v2-35-security-holes.json';
import rawAct6Separator from './schemas/slide-vibecoding-v2-36-act6-separator.json';
import rawOrchestration from './schemas/slide-vibecoding-v2-37-orchestration.json';

const sid = VIBECODING_DECK_SLIDE_IDS;

/**
 * Активные JSON-слайды вайбкодинг-деки. Сценарий — `vibecoding-deck-plan.md`.
 * Legacy-слайды прежней версии: `./archive/legacyJsonSlides.ts`.
 */
export const vibecodingJsonSlides: JsonSlideDefinition[] = [
  defineJsonSlide({
    id: sid.cover,
    title: 'Вайбкодинг',
    theme: 'editorial',
    raw: rawCover,
    source: 'slide-vibecoding-v2-01-cover.json',
    notes: 'Акт I · Обложка. Пролог — путь героя от идеи к продукту.',
  }),
  defineJsonSlide({
    id: sid.aboutMe,
    title: 'Евсеичев Антон',
    theme: 'editorial',
    raw: rawAboutMe,
    source: 'slide-about-me.json',
    notes: 'Кто ведёт: имя, роли, Floux.pro founder; тот же JSON, что в main-деке.',
  }),
  defineJsonSlide({
    id: sid.why,
    title: 'А зачем?',
    theme: 'cinema',
    raw: rawWhy,
    source: 'slide-vibecoding-v2-01b-why.json',
    notes: 'Короткий тёмный вопросительный слайд после обложки — пауза «а зачем вообще всё это».',
  }),
  defineJsonSlide({
    id: sid.pastTeam,
    title: 'Раньше: команда и полгода',
    theme: 'editorial',
    raw: rawPastTeam,
    source: 'slide-vibecoding-v2-02-past-team.json',
    notes: 'Акт I · Обычный мир. MVP как команда из 5–6 человек и полугода.',
  }),
  defineJsonSlide({
    id: sid.nowSoloAi,
    title: 'Сейчас: один + ИИ × недели',
    theme: 'editorial',
    raw: rawNowSoloAi,
    source: 'slide-vibecoding-v2-03-now-solo-ai.json',
    notes: 'Акт I · Зов к приключению. Сдвиг: доступ к производству продуктов, не революция в коде.',
  }),
  defineJsonSlide({
    id: sid.shiftIsReal,
    title: 'Сдвиг уже случился',
    theme: 'editorial',
    raw: rawShiftIsReal,
    source: 'slide-vibecoding-v2-04-shift-is-real.json',
    notes: 'Акт I · Подтверждение. Цифры: App Store ≈8–11K/нед, стоимость MVP ~$40–80K медиана.',
  }),
  defineJsonSlide({
    id: sid.booster,
    title: 'Вайбкодинг — бустер',
    theme: 'editorial',
    raw: rawBooster,
    source: 'slide-vibecoding-v2-05-booster.json',
    notes: 'Акт I · Переход порога. Определение Карпатого: ты — куратор контекста, агент — руки.',
  }),
  defineJsonSlide({
    id: sid.futureRole,
    title: 'Как мы себя видим в этом будущем?',
    theme: 'cinema',
    raw: rawFutureRole,
    source: 'slide-vibecoding-v2-05b-future-role.json',
    notes: 'Короткий тёмный вопросительный слайд после «бустера» — пауза перед героем: кем мы становимся в этом будущем.',
  }),
  defineJsonSlide({
    id: sid.outcomesLadder,
    title: 'Пять уровней ставок в вайбкодинге',
    theme: 'editorial',
    raw: rawOutcomes,
    source: 'slide-vibecoding-v2-05c-outcomes.json',
    notes: 'Акт I · Призыв. Лестница целей: от анимированных прототипов и Figma-дополнений к замене Figma, pet-проекту и полному циклу продукта. Каждому уровню соответствует свой объём инструментов и правил.',
  }),
  defineJsonSlide({
    id: sid.hero,
    title: 'Герой: дизайнер с идеями',
    theme: 'editorial',
    raw: rawHero,
    source: 'slide-vibecoding-v2-06-hero.json',
    notes: 'Акт I · Герой. Слушатель узнаёт себя: дизайнер с идеями, без команды и года — и с главным вопросом «как превращать идеи в продукты».',
  }),
  defineJsonSlide({
    id: sid.threeFears,
    title: 'Три страха на пороге',
    theme: 'editorial',
    raw: rawThreeFears,
    source: 'slide-vibecoding-v2-07-three-fears.json',
    notes: 'Акт I · Отказ от зова. Три возражения дизайнера — почему они звучат убедительно и куда уводят от действия.',
  }),
  defineJsonSlide({
    id: sid.act2Separator,
    title: 'Акт II · Сначала задача',
    theme: 'editorial',
    raw: rawAct2Separator,
    source: 'slide-vibecoding-v2-08-act2-separator.json',
    notes: 'Сепаратор Акта II. Переключение с «почему» на «чем».',
  }),
  defineJsonSlide({
    id: sid.landscape,
    title: 'Три трека инструментов',
    theme: 'editorial',
    raw: rawLandscape,
    source: 'slide-vibecoding-v2-09-landscape.json',
    notes: 'Акт II · Карта дорог. Три трека: агент в репо, облачные конструкторы, UI-вход с макета.',
  }),
  defineJsonSlide({
    id: sid.sandboxes,
    title: 'Облачные песочницы',
    theme: 'editorial',
    raw: rawSandboxes,
    source: 'slide-vibecoding-v2-10-sandboxes.json',
    notes: 'Акт II · Лёгкий вход. Replit / Lovable / Bolt.new / Figma Make — с чего начать завтра утром без установки.',
  }),
  defineJsonSlide({
    id: sid.constructorVsAgent,
    title: 'Конструктор vs Агент-в-репо',
    theme: 'editorial',
    raw: rawConstructorVsAgent,
    source: 'slide-vibecoding-v2-12-constructor-vs-agent.json',
    notes: 'Акт II · Две среды для агента. Replit/Lovable (готовая площадка) vs Cursor/Claude Code (твой репозиторий): где живёт код, стек, что делает агент, потолок.',
  }),
  defineJsonSlide({
    id: sid.agentVsChat,
    title: 'Чат vs Агент',
    theme: 'editorial',
    raw: rawAgentVsChat,
    source: 'slide-vibecoding-v2-11-agent-vs-chat.json',
    notes: 'Акт II · Что такое агент. Определение через доступ: у чата только текст, у агента — файлы, терминал и git проекта.',
  }),
  defineJsonSlide({
    id: sid.cursorVsClaude,
    title: 'Cursor vs Claude Code',
    theme: 'editorial',
    raw: rawCursorVsClaude,
    source: 'slide-vibecoding-v2-13-cursor-vs-claude.json',
    notes: 'Акт II · Сравнение. Хирург и архитектор: философия, интерфейс, модель работы, окно, сила, скорость — на featureList.',
  }),
  defineJsonSlide({
    id: sid.pricing,
    title: 'Цена и ёмкость',
    theme: 'editorial',
    raw: rawPricing,
    source: 'slide-vibecoding-v2-14-pricing.json',
    notes: 'Акт II · Цена. $200/мес одинаково, но объём разный: Cursor Ultra ~138 агент-часов + 1× топ-модели; Claude Code Max 20× ~678 агент-часов + ~38× Opus. Перед лекцией сверить актуальные прайсы Anthropic/Cursor.',
  }),
  defineJsonSlide({
    id: sid.claudeIdeEntry,
    title: 'Claude Code & IDE',
    theme: 'editorial',
    raw: rawClaudeIdeEntry,
    source: 'slide-vibecoding-v2-16-claude-ide-entry.json',
    notes: 'Акт II · Как v2-15/19: header + mediaGallery. Ассет: public/vibe/claude.png.',
    preloadAssets: ['/vibe/claude.png'],
  }),
  defineJsonSlide({
    id: sid.cursorForDesigners,
    title: 'Cursor и дизайнер',
    theme: 'editorial',
    raw: rawCursorForDesigners,
    source: 'slide-vibecoding-v2-15-cursor-for-designers.json',
    notes: 'Акт II · Как v2-19 (valley): header + mediaGallery, video loop. Ассет: public/vibe/cursor.mp4. Тема слайда — editorial в defineJsonSlide (как у valley), иначе theme: signal даёт синий #0047ab.',
    preloadAssets: ['/vibe/cursor.mp4'],
  }),
  defineJsonSlide({
    id: sid.localSetup,
    title: 'Локальный стек: Node, Xcode, Flutter',
    theme: 'editorial',
    raw: rawLocalSetup,
    source: 'slide-vibecoding-v2-16b-local-setup.json',
    notes: 'Акт II · Что ставится руками до первой команды агенту. equalColumns × 3: Node.js (веб/JS), Xcode (iOS/RN), Flutter (кроссплатформа). Тон — факт, не инструкция.',
  }),
  defineJsonSlide({
    id: sid.act3Separator,
    title: 'Акт III · Ключи к мастерству',
    theme: 'editorial',
    raw: rawAct3Separator,
    source: 'slide-vibecoding-v2-17-act3-separator.json',
    notes: 'Сепаратор Акта III. textStack + mesh, как v2-08. Переход от каталога к механике и дисциплине.',
  }),
  defineJsonSlide({
    id: sid.iterationsNotMagic,
    title: 'Сильный результат в цикле',
    theme: 'editorial',
    raw: rawIterationsNotMagic,
    source: 'slide-vibecoding-v2-18-iterations-not-magic.json',
    notes: 'Акт III · Цикл обратной связи: 4 шага (featureList) + манёвр Карпатого — полный stack trace агенту.',
  }),
  defineJsonSlide({
    id: sid.valleyOfDespair,
    title: 'Долина отчаяния',
    theme: 'editorial',
    raw: rawValleyOfDespair,
    source: 'slide-vibecoding-v2-19-valley-of-despair.json',
    notes: 'Акт III · Слайд-картинка (кривая / метафора). Шаблон как slide-floux-demo: header + mediaGallery. Ассет: public/vibe/danning.png.',
    preloadAssets: ['/vibe/danning.png'],
  }),
  defineJsonSlide({
    id: sid.contextWindow,
    title: 'Контекстное окно',
    theme: 'editorial',
    raw: rawContextWindow,
    source: 'slide-vibecoding-v2-19-context-window.json',
    notes: 'Акт III · Механика агента. Контекстное окно как рабочий стол: ограничен, не резиновый, всё вне него не существует.',
  }),
  defineJsonSlide({
    id: sid.summarization,
    title: 'Саммаризация и её цена',
    theme: 'editorial',
    raw: rawSummarization,
    source: 'slide-vibecoding-v2-20-summarization.json',
    notes: 'Акт III · Механика агента. Саммаризация — штатная механика, не баг; теряются нюансы ТЗ, имена переменных, конкретные числа.',
  }),
  defineJsonSlide({
    id: sid.contextDrift,
    title: 'Дрейф контекста',
    theme: 'editorial',
    raw: rawContextDrift,
    source: 'slide-vibecoding-v2-21-context-drift.json',
    notes: 'Акт III · Механика агента. Дрейф как ожидаемый эффект саммаризации; симптомы и причина — начало сессии выходит за видимость.',
  }),
  defineJsonSlide({
    id: sid.mdMemory,
    title: 'Память в md-файлах',
    theme: 'editorial',
    raw: rawMdMemory,
    source: 'slide-vibecoding-v2-22-md-memory.json',
    notes: 'Акт III · Механика агента. CLAUDE.md / AGENTS.md / .cursorrules как проектируемая память; статичный бриф и Auto Memory.',
  }),
  defineJsonSlide({
    id: sid.act4Separator,
    title: 'Акт IV · Союзники героя',
    theme: 'editorial',
    raw: rawAct4Separator,
    source: 'slide-vibecoding-v2-23-act4-separator.json',
    notes: 'Сепаратор Акта IV. textStack + mesh, как v2-08 и v2-17. Переход от механики к артефактам: правила, скиллы, субагенты, MCP.',
  }),
  defineJsonSlide({
    id: sid.rulesPredictable,
    title: 'Правила делают агента предсказуемым',
    theme: 'editorial',
    raw: rawRulesPredictable,
    source: 'slide-vibecoding-v2-24-rules-predictable.json',
    notes: 'Акт IV · Союзники. Правила как «кодекс до промпта»: где живут (CLAUDE.md / .cursorrules / AGENTS.md) и что внутри (стек, стиль, запреты, порядок).',
  }),
  defineJsonSlide({
    id: sid.rulesExample1,
    title: 'Пример 1 · Правила как рабочий конспект',
    theme: 'editorial',
    raw: rawRulesExample1,
    source: 'slide-vibecoding-v2-25-rules-example-1.json',
    notes: 'Акт IV · Живой пример CLAUDE.md / .cursorrules. Открытый вопрос: какой проект показать — ассет пока плейсхолдер /vibe/rules-example-1.png.',
    preloadAssets: ['/vibe/rules-example-1.png'],
  }),
  defineJsonSlide({
    id: sid.rulesExample2,
    title: 'Пример 2 · Правила под проект',
    theme: 'editorial',
    raw: rawRulesExample2,
    source: 'slide-vibecoding-v2-26-rules-example-2.json',
    notes: 'Акт IV · Второй пример, контрастный по стеку и акцентам. Открытый вопрос: какой второй проект показать — ассет пока плейсхолдер /vibe/rules-example-2.png.',
    preloadAssets: ['/vibe/rules-example-2.png'],
  }),
  defineJsonSlide({
    id: sid.skills,
    title: 'Скиллы — рецепты под повторяющиеся задачи',
    theme: 'editorial',
    raw: rawSkills,
    source: 'slide-vibecoding-v2-27-skills.json',
    notes: 'Акт IV · Союзники. Скилл — папка с инструкциями, примерами и условиями срабатывания. Правила — всегда, скилл — при узнавании паттерна. Открытый вопрос: терминология 2026 — сверить с продуктовым неймингом (skills у Claude Code / recipes у Cursor).',
  }),
  defineJsonSlide({
    id: sid.subagents,
    title: 'Субагенты — параллель без засорения главного контекста',
    theme: 'editorial',
    raw: rawSubagents,
    source: 'slide-vibecoding-v2-28-subagents.json',
    notes: 'Акт IV · Союзники. Субагент = отдельный контекст. Cursor — параллельные сессии в изолированных VM; Claude Code — иерархия lead → специалисты и сводка. Справа — mediaGallery cellVariant fill; ассет в JSON (public/vibe/).',
    preloadAssets: ['/vibe/3e73e7e9-d06e-4948-90f2-4de3a9f831e5.gif'],
  }),
  defineJsonSlide({
    id: sid.allySetup,
    title: 'Как создать скилл и субагента в Claude Code и Cursor',
    theme: 'editorial',
    raw: rawAllySetup,
    source: 'slide-vibecoding-v2-28b-ally-setup.json',
    notes: 'Акт IV · Союзники. Команды и пути файлов: Claude Code — /skills и /agents, .claude/skills/<name>/SKILL.md и .claude/agents/<name>.md с YAML-шапками. Cursor — .cursor/rules/*.mdc и Background Agents из Command Palette. Перед лекцией сверить актуальную терминологию Cursor 2026.',
  }),
  defineJsonSlide({
    id: sid.mcp,
    title: 'MCP — руки агента во внешнем мире',
    theme: 'editorial',
    raw: rawMcp,
    source: 'slide-vibecoding-v2-29-mcp.json',
    notes: 'Акт IV · Союзники. MCP как стандарт действий снаружи: Postgres (схема и живой запрос), Context7 (свежая документация), Figma MCP (Dev Mode, ~14 тулов; запись в канву на 2026 может быть в бете).',
  }),
  defineJsonSlide({
    id: sid.agentModes,
    title: 'Режимы работы агентов',
    theme: 'editorial',
    raw: rawAgentModes,
    source: 'slide-vibecoding-v2-29b-agent-modes.json',
    notes: 'Акт IV · Союзники. Четыре режима одного агента: Agent (правит код и запускает команды), Plan (только план без правок), Debug (ищет корень проблемы), Ask (только отвечает, не трогает файлы). Выбор режима до запроса меняет поведение агента сильнее, чем сам промпт.',
  }),
  defineJsonSlide({
    id: sid.act5Separator,
    title: 'Акт V · Главное испытание',
    theme: 'editorial',
    raw: rawAct5Separator,
    source: 'slide-vibecoding-v2-30-act5-separator.json',
    notes: 'Сепаратор Акта V. textStack + mesh, как v2-08/17/23. Эмоциональный переход от мастерства к масштабу и рискам: демка ещё не продукт.',
  }),
  defineJsonSlide({
    id: sid.costOfReliability,
    title: 'Цена надёжности: 3 часа доводки на 1 час прототипа',
    theme: 'editorial',
    raw: rawCostOfReliability,
    source: 'slide-vibecoding-v2-34-cost-of-reliability.json',
    notes: 'Акт V · Главное испытание. Медиана ~3 часа доводки на 1 час прототипа (порядок величины). Edge cases, обработка ошибок, производительность — невидимая работа после валидации идеи. Связка с 33: Accept All тут особенно дорог.',
  }),
  defineJsonSlide({
    id: sid.doomLoop,
    title: 'Doom Loop: починка порождает поломки',
    theme: 'editorial',
    raw: rawDoomLoop,
    source: 'slide-vibecoding-v2-32-doom-loop.json',
    notes: 'Акт V · Главное испытание. Симптомы (возврат бага, рост кода при падении понимания, страх рефакторить) и причины (контекстная гниль, монолит, отсутствие правил).',
  }),
  defineJsonSlide({
    id: sid.basicsMatter,
    title: 'Без опоры в основах вайбкодинг застревает в Accept All',
    theme: 'editorial',
    raw: rawBasicsMatter,
    source: 'slide-vibecoding-v2-33-basics-matter.json',
    notes: 'Акт V · Главное испытание. Четыре опоры (Git, UI-стек, Node/бэк, БД) и правая плашка про Accept All. Открытый вопрос: добавить HTTP/API вместо/рядом с Node.',
  }),
  defineJsonSlide({
    id: sid.securityHoles,
    title: 'Критичные дыры в вайб-продуктах: факт, не паника',
    theme: 'editorial',
    raw: rawSecurityHoles,
    source: 'slide-vibecoding-v2-35-security-holes.json',
    notes: 'Акт V · Главное испытание. Исследования 2025–2026: ~70% приложений уходят в прод с критичными уязвимостями на банальных сценариях. Три колонки: RLS (Supabase/Postgres), вебхуки платежей, инъекции/валидация. Тон — факт, не алармизм.',
  }),
  defineJsonSlide({
    id: sid.act6Separator,
    title: 'Акт VI · Возвращение',
    theme: 'editorial',
    raw: rawAct6Separator,
    source: 'slide-vibecoding-v2-36-act6-separator.json',
    notes: 'Сепаратор Акта VI. textStack + mesh, как v2-08/17/23/30. Переход от испытания к эпилогу: кем выходишь из этой линии и что сделать завтра утром.',
  }),
  defineJsonSlide({
    id: sid.orchestration,
    title: 'Главный переносимый навык — оркестрация',
    theme: 'editorial',
    raw: rawOrchestration,
    source: 'slide-vibecoding-v2-37-orchestration.json',
    notes: 'Акт VI · Возвращение с эликсиром. Оркестрация — соединение людей, агентов, правил, контекста и собственного понимания. Четыре опоры: выбор инструмента по задаче, вынесение знания в md/правила/скиллы/MCP, субагенты и ревью, предвосхищение рисков. Навык переносится на следующие инструменты и модели.',
  }),
];
