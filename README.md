# NestWise

**The AI learning companion for pregnancy and a child's first three years.** A personalised path
through pregnancy, birth and early childhood — lessons, quizzes, illustrated activities, and an AI
tutor that knows your stage.

> NestWise provides **educational information and decision support — not medical diagnosis or
> emergency care**. It is not an emergency service. See `/about-safety` in the app.

---

## What makes it a learning platform

- **Personalised learning path.** The home dashboard recommends your next lesson from your
  pregnancy week (or child's age), your stated interests, and what you've already completed — and
  always shows *why* (`src/lib/personalization/recommend.ts`).
- **Ask NestWise — an AI tutor.** Retrieval-first: every answer is grounded in reviewed content
  and cites its sources. Choose an answer style (*explain simply / standard / go deeper*), get
  suggested follow-up questions, and urgent questions are routed to real help. Uses the Claude API
  when a key is present (`src/lib/ai/llm.ts`, model `claude-opus-5`), with a deterministic
  grounded fallback so it works with zero config.
- **Rich lessons.** 16 pregnancy modules, ~48 lessons — each with a real explanation, "why it
  matters", practical tips, what to avoid, a short related video, and links to related lessons.
- **A quiz per module.** 6–7 questions each with instant explanations. NestWise tracks what you
  get wrong and builds a **"review what you missed"** set (`/quiz/review`).
- **Learn by seeing.** Every movement/exercise has a hand-drawn, gently animated figure
  (`src/components/ui/ExerciseFigure.tsx`); child games are picture-based.
- **Scope: pregnancy → age 3.** Month-by-month development for the first year, then Age 1–2 and
  Age 2–3. Age-appropriate games (colours, shapes, animals, first numbers/letters, emotions,
  matching, patterns) — no school-age material.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 — a warm hand-drawn "sketchbook" theme |
| DB / ORM | PostgreSQL + Prisma |
| Auth | Auth.js (NextAuth v5), Credentials provider (bcrypt) |
| AI | `@anthropic-ai/sdk` (Claude) with a deterministic RAG fallback + Level 1/2/3 safety layer |
| Tests | Vitest (unit + integration), Playwright (E2E) |

## Quick start

```bash
cp .env.example .env                       # DATABASE_URL, AUTH_SECRET (+ optional ANTHROPIC_API_KEY)
docker compose up -d db                    # or a local Postgres; create role/db to match .env
npm install
npx prisma db push
npm run seed                               # curated content + a demo account
npm run dev                                # http://localhost:3000
```

Demo login: **demo@nestwise.test** / **nestwise123** (seeded ~18 weeks pregnant, vegetarian,
peanut allergy).

To turn on the real AI tutor, set `ANTHROPIC_API_KEY` in `.env` (or run `ant auth login`). Without
it, Ask NestWise still answers — grounded in curated content, just phrased by a template.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run seed` | Load `src/content/**` into the database (prunes stale rows) |
| `npm test` | Vitest unit + integration |
| `npm run test:e2e` | Playwright journeys (needs a seeded DB) |
| `npm run typecheck` | `tsc --noEmit` |

## Content status

Educational copy is **evidence-informed placeholder scaffolding**, structured for later clinical
review, with the correct safety framing and no invented medical advice. Content lives in the DB so
it can be reviewed and updated without touching the UI.
