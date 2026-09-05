# NestWise

A family learning companion that grows with the family: **Pregnancy → Birth → Newborn → Toddler →
Child → Family Learning**. Built from [`NestWise_PRD.md`](./NestWise_PRD.md).

> NestWise provides **educational information and decision support — not medical diagnosis or
> emergency care**. It is not an emergency service. See `/about-safety` in the app.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 with `@theme` design tokens (three journey palettes, light/dark) |
| DB / ORM | PostgreSQL + Prisma |
| Auth | Auth.js (NextAuth v5), Credentials provider (email + password, bcrypt) |
| AI | **Ask NestWise** = keyword retrieval over curated content + full Level 1/2/3 safety layer. No LLM key required; the model call is isolated in `src/lib/ai/llm.ts` for a later swap. |
| Tests | Vitest (unit + integration), Playwright (E2E) |

## Quick start

```bash
cp .env.example .env                       # DATABASE_URL, AUTH_SECRET

# Postgres — either Docker…
docker compose up -d db
# …or a local Postgres; then create the role/db to match .env:
#   createuser -s nestwise && createdb -O nestwise nestwise

npm install
npx prisma db push                         # create the schema
npm run seed                               # load curated (placeholder) content
npm run dev                                # http://localhost:3000
```

Demo login (created by the seed): **demo@nestwise.test** / **nestwise123**
(seeded ~19 weeks pregnant, vegetarian, peanut allergy).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run seed` | Load `src/content/**` into the database |
| `npm run db:migrate` / `db:reset` | Prisma migrate / reset + reseed |
| `npm test` | Vitest unit + integration (`tests/unit`, `tests/integration`) |
| `npm run test:e2e` | Playwright journeys (`tests/e2e`) — needs a seeded DB |
| `npm run typecheck` | `tsc --noEmit` |

## How it's organised

```
prisma/schema.prisma          data model (PRD §49)
prisma/seed.ts                loads src/content/** + a demo user

src/
  app/
    (auth)/                   login, signup
    onboarding/               journey → role → pregnancy/child → preferences (PRD §5)
    (app)/                    authenticated, stage-aware shell (PRD §6, §7)
      home  journey  learn  quiz  nutrition  exercise  symptoms  ask  facts  resources
      birth/*  postpartum/*   child/*   search  settings  settings/family
    api/ ask  search  export  auth/[...nextauth]
  components/ ui  nav  child  safety  + ContentDetail / ContentListPage / InteractiveChecklist
  lib/
    auth/         NextAuth config + session/family-context helpers
    personalization/  pregnancy-week & age math, stage resolver, content filter
    ai/           retrieve → answer pipeline; llm.ts is the swap point
    safety/       Level 1/2/3 classifier + shared disclaimers (PRD §11, §51)
    games/        data-driven learning-game engine (PRD §31–§33)
    actions/      server actions (bookmarks, progress, checklists, journal, routines, settings…)
  content/        curated content as typed modules (source of truth, reviewable)
  types/
tests/ unit  integration  e2e
```

## Safety model (PRD §11, §50, §51)

`answerQuestion()` in `src/lib/ai/answer.ts`:

1. `classifyCategory` → pregnancy / birth / postpartum / baby / parenting / general
2. `retrieve` → top curated `Content` by keyword/TF score
3. answer composed **only** from retrieved `keyTakeaways` + summary (no free-styled medical claims)
4. `classifySafety` → **L1** educational · **L2** cautious + warning signs + "see a professional" ·
   **L3** prominent emergency banner with the PRD's verbatim disclaimer
5. sources shown with every health answer; every `Content` row carries `source` + `reviewedAt`

Escalation wording is placeholder and must be developed with qualified medical review and localised
before any real launch (PRD §51).

## Content status

All educational copy in this build is **clearly-labelled placeholder** (`source: "Placeholder —
pending expert review"`) with the correct structure and safety framing. No authoritative medical
advice is invented (PRD §63.9). Content lives in the DB so it can later be reviewed and updated
without touching the UI.

## Known deferrals (vs. the full PRD)

Admin CMS (§59) — content is edited via DB/seed · real email/push delivery (§42) — preference UI
only · AI instructor avatar (§14.1) · vector search (§55) — keyword retrieval instead · multi-locale
(§44.7) — `en` shipped, copy centralised · real object storage for journal photos (§38) — entries
are text-only in this build.
