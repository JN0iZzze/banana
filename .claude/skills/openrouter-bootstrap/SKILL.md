---
name: openrouter-bootstrap
description: Пошагово, в диалоговом режиме, подключает к проекту интеграцию с OpenRouter — единым API-шлюзом к моделям OpenAI, Anthropic, Google, Meta и др. Определяет стек, проводит через создание аккаунта и API-ключа, ставит server-side прокси (ключ никогда не уходит в браузер), кладёт ключ в .env через запрос у пользователя и в конце проверяет рабочим пингом, что запросы доходят. На выходе — «интеграция готова, можно делать ИИ-функции», без реализации конкретной AI-фичи. Используется когда пользователь говорит «подключи OpenRouter», «настрой LLM/ИИ-бэкенд», «прикрути генерацию через нейросеть», «openrouter-bootstrap» или хочет добавить в проект вызовы языковых моделей.
---

# OpenRouter Bootstrap

Этот скилл доводит проект до состояния **«интеграция с OpenRouter готова»** и не дальше. Он ставит безопасный канал к моделям и проверяет, что запросы идут. Конкретную AI-фичу (генерация слайдов, чат, суммаризация — что угодно) скилл **не реализует** — это следующий, отдельный шаг.

## Железные правила

1. **Диалоговый режим.** Не делай всё молча. Каждую фазу проговаривай, спрашивай подтверждение перед записью файлов и перед командами, которые ставят зависимости. Один вопрос за раз, без простыни.
2. **Ключ не вшивается. Никогда.** API-ключ запрашивается у пользователя и кладётся только в `.env` (или в env-переменные хостинга). В коде, в репозитории, в клиентском бандле ключа быть не должно.
3. **Ключ живёт на сервере.** Браузер ходит на свой эндпоинт (`/api/...`), а уже сервер ходит в OpenRouter с ключом. Прямой вызов OpenRouter из фронтового кода — запрещён (ключ утечёт в бандл, см. фазу 5).
4. **Не реализуй фичу.** Прокси отдаёт ответ модели на тестовый промпт — и всё. Никаких продуктовых функций, UI, промпт-инжиниринга. Финал — рабочий пинг.
5. **Источник правды — пользователь.** Только он создаёт аккаунт, кладёт деньги на баланс и вставляет ключ. Ты не выдумываешь ключ и не предполагаешь, что он есть.

## Фаза 0 — Разведка проекта

Прежде чем что-то предлагать, определи стек. Посмотри:

- `package.json` → есть ли `next`, `express`, `fastify`, `vite`, `@sveltejs/kit`, `nuxt`; какой менеджер пакетов (`package-lock.json` → npm, `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb` → bun).
- `requirements.txt` / `pyproject.toml` → Python (FastAPI / Flask).
- Есть ли уже серверный слой или это чистый клиентский SPA.

Сформулируй вслух вывод: **«У тебя <стек>. Прокси сделаем по рецепту <X>. Ок?»** — и жди подтверждения. Если стека из таблицы ниже нет — спроси, какой бэкенд-язык доступен, и собери прокси по аналогии (любой серверный обработчик, который читает `OPENROUTER_API_KEY` из окружения и проксирует POST в OpenRouter).

| Что нашли | Рецепт прокси |
|---|---|
| Next.js (App Router) | Route Handler `app/api/llm/route.ts` |
| Next.js (Pages Router) | `pages/api/llm.ts` |
| Node + Express/Fastify | Роут `POST /api/llm` в существующем сервере |
| Чистый Vite SPA (нет бэкенда) | Vite-плагин с dev-middleware **+** предупреждение про прод |
| SvelteKit / Nuxt | Серверный эндпоинт фреймворка (`+server.ts` / `server/api`) |
| Python (FastAPI / Flask) | Роут `POST /api/llm` |

## Фаза 1 — Аккаунт и ключ OpenRouter

Дай пользователю точную инструкцию (это делает он сам, в браузере):

1. Зайти на **https://openrouter.ai** и войти (Google/GitHub/email).
2. Создать ключ: **https://openrouter.ai/settings/keys** → **Create Key**, скопировать. Формат: `sk-or-v1-...`.
3. Для пинга деньги не нужны — проверочный запрос идёт на бесплатную модель `openrouter/free`. Если дальше планируешь платные модели, положи кредиты в **Settings → Credits**.
4. Ключ показывается один раз — пусть скопирует сразу.

Затем **попроси прислать ключ в чат** (или, если пользователь не хочет светить ключ ассистенту — пусть сам вставит его в `.env` по шаблону из фазы 2, а тебе скажет «вставил»). Никогда не печатай присланный ключ обратно в ответах и не коммить его.

## Фаза 2 — .env и .gitignore

1. Проверь `.gitignore` — строка `.env` должна там быть. Если нет — добавь **до** записи ключа.
2. Создай/дополни `.env` (НЕ `.env.example`):
   ```
   OPENROUTER_API_KEY=sk-or-v1-...сюда-ключ-пользователя...
   ```
   **Критично:** имя переменной — `OPENROUTER_API_KEY`, **без префикса `VITE_` / `NEXT_PUBLIC_` / `PUBLIC_`**. Любой такой префикс заставляет сборщик зашить значение в клиентский бандл — это и есть утечка.
3. Создай `.env.example` с пустым значением — он коммитится и документирует переменную:
   ```
   OPENROUTER_API_KEY=
   ```

## Фаза 3 — Server-side прокси

Отдельный HTTP-клиент не нужен — используем встроенный `fetch` (Node 18+, Python — `httpx`). Выбери рецепт по фазе 0. Во всех случаях контракт один: фронт шлёт `POST /api/llm` с `{ messages }`, прокси добавляет ключ и проксирует в OpenRouter.

> **Почему сырой `fetch`, а не SDK.** Доки OpenRouter по умолчанию советуют их официальный `@openrouter/sdk` (TS) / `openrouter` (Python). Здесь сознательно используется голый HTTP: прокси тривиальный, и `fetch` даёт ноль зависимостей и один и тот же код во всех рецептах ниже. Если хочешь SDK — он ставится поверх без изменения контракта `/api/llm`. OpenAI SDK тоже работает как drop-in: `baseURL: "https://openrouter.ai/api/v1"`.

Общие константы OpenRouter:
- Base URL: `https://openrouter.ai/api/v1`
- Эндпоинт: `POST /chat/completions`
- Заголовок: `Authorization: Bearer ${OPENROUTER_API_KEY}`
- Тело: `{ "model": "...", "messages": [...] }`
- Опционально (для рейтингов на openrouter.ai): заголовки `HTTP-Referer: <url сайта>` и `X-OpenRouter-Title: <название>`.
- Модель для пинга — `openrouter/free` (бесплатно). Для продакшена выбирай из раздела **Models** на дашборде; есть latest-алиасы вроде `~openai/gpt-latest`.

### Next.js (App Router) — `app/api/llm/route.ts`
```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, model } = await req.json();
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: model ?? "openrouter/free", messages }),
  });
  if (!r.ok) return NextResponse.json({ error: await r.text() }, { status: r.status });
  return NextResponse.json(await r.json());
}
```

### Node + Express — роут в существующем сервере
```ts
app.post("/api/llm", async (req, res) => {
  const { messages, model } = req.body;
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: model ?? "openrouter/free", messages }),
  });
  res.status(r.status).json(await r.json());
});
```
Убедись, что сервер грузит `.env` (`import "dotenv/config";` или `node --env-file=.env`).

### Чистый Vite SPA (нет бэкенда) — Vite-плагин с dev-middleware
У SPA нет сервера, поэтому делаем серверный обработчик прямо внутри dev-сервера Vite. В `vite.config.ts`:
```ts
import { defineConfig, type Plugin } from "vite";

function openRouterProxy(): Plugin {
  return {
    name: "openrouter-proxy",
    configureServer(server) {
      server.middlewares.use("/api/llm", async (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", async () => {
          const { messages, model } = JSON.parse(body || "{}");
          const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ model: model ?? "openrouter/free", messages }),
          });
          res.setHeader("Content-Type", "application/json");
          res.statusCode = r.status;
          res.end(await r.text());
        });
      });
    },
  };
}

export default defineConfig({ plugins: [/* ...твои плагины, */ openRouterProxy()] });
```
Vite сам читает `.env` (через `loadEnv`), но в `process.env` переменная без префикса не попадёт — поэтому стартуй dev с подгрузкой env: `node --env-file=.env node_modules/vite/bin/vite.js` или добавь `import "dotenv/config";` в начало `vite.config.ts` (поставив `dotenv` в devDependencies).

> **Громко предупреди пользователя:** этот middleware живёт только в `vite dev`. После `vite build` сервера нет — в проде нужен отдельный serverless-роут или Node-сервер с тем же кодом прокси. Для прода в SPA так не задеплоить.

### Python (FastAPI) — `POST /api/llm`
```python
import os, httpx
from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/api/llm")
async def llm(req: Request):
    payload = await req.json()
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {os.environ['OPENROUTER_API_KEY']}"},
            json={"model": payload.get("model", "openrouter/free"),
                  "messages": payload["messages"]},
        )
    return r.json()
```

## Фаза 4 — Тонкий клиентский вызов (опционально, без фичи)

Если в проекте есть фронт, добавь **минимальную обёртку** — только чтобы было что вызвать в фазе 5. Не строй UI и не пиши продуктовых промптов.
```ts
export async function askLLM(messages: { role: string; content: string }[]) {
  const res = await fetch("/api/llm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error(`LLM proxy error: ${res.status}`);
  return res.json();
}
```

## Фаза 5 — Проверка, что всё работает

Это обязательный финал. Два чека:

**1. Прокси отвечает.** Запусти проект (`npm run dev` / `uvicorn ...`) и пингани свой эндпоинт:
```bash
curl -s -X POST http://localhost:5173/api/llm \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Ответь одним словом: pong"}]}' | head -c 800
```
(порт подставь свой). Успех — JSON с `choices[0].message.content`. Покажи ответ пользователю.

Частые ошибки и что говорить:
- `401 No auth credentials` → ключ не подхватился. Проверь, что `.env` грузится в процесс (`--env-file` / `dotenv`), имя переменной точное.
- `402 / insufficient credits` → нет баланса, пусть пополнит в Credits или возьмёт модель `:free`.
- `404 model not found` → опечатка в `model`, сверь со списком на дашборде.

**2. Ключ НЕ утёк в клиент.** Если есть сборка фронта — собери и проверь бандл:
```bash
npm run build && grep -rn "sk-or-" dist/ build/ .next/ 2>/dev/null && echo "❌ КЛЮЧ В БАНДЛЕ" || echo "✅ ключа в бандле нет"
```
Если ключ нашёлся — значит переменную читают с префиксом `VITE_`/`NEXT_PUBLIC_` или ключ хардкоднут. Чини до зелёного.

## Финал

Когда оба чека зелёные — отрапортуй ровно так:

> **Интеграция с OpenRouter готова.** Прокси `/api/llm` работает, ключ лежит в `.env` и не попадает в браузер, тестовый запрос вернул ответ модели. Можно делать ИИ-функции — вызывай `askLLM(...)` (или `POST /api/llm`) из продуктового кода.

И остановись. Конкретную фичу — отдельной задачей.
