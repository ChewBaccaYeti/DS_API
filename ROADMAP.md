# USG Ishimura CEC — Roadmap & Build Plan

Living document. Ticks off as milestones land. Sections are ordered by priority.

---

## Part I — Analysis of current state

### Backend (`CEC/ships/USG_Ishimura/bridge`)

**Strengths**

-   Helmet + rate-limit + compression + CORS wired in `pipe.js`.
-   Clean route layering (`index.routes.ts` → per-resource routers → controllers
    → models).
-   Env validation on startup (`server.js:28`) — fails fast on missing Mongo
    creds.

**Weaknesses**

-   **No input validation.** All endpoints are `GET`. When POST/PUT lands,
    Mongoose alone is not enough. Add Zod schemas at the route layer.
-   **No authentication.** Anyone can hit `/api/*`. Needs JWT + role-based
    access (CEC clearance levels).
-   **No pagination.** `Miner.find()` returns everything. At 10k crew members
    the UI dies.
-   **Inconsistent error shape.** `miner.controller.ts:13` sends
    `res.status(500).send('Error...')` — plain text, contradicts the Swagger
    spec (JSON). Wrap all errors in a common envelope.
-   **`logAllData()` on boot.** Runs a full fetch of miners/engineers/scientists
    on every server start. Kills startup time when DB grows. Move behind a
    `/api/debug/dump` route or drop it.
-   **Rate limit is global.** 100 req / 15 min for the whole API. Tier by route
    (public reads: 200/min, mutations: 20/min).
-   **No health check.** Kubernetes / uptime monitors have no `/api/health` to
    probe.
-   **Swagger file exists but is not served.** Ship `swagger-ui-express` at
    `/api/docs`.
-   **`archive/` compile step doubles the pipeline.** Backend runs `.js` from
    `archive/`, frontend also passes through webpack. Consolidate.
-   **Console.log + Winston mixed.** Pick one. Winston with `pretty` transport
    in dev, JSON in prod.
-   **Schema drift.** `lastMission` is an array in Mongoose but a single object
    in Swagger. Pick one and align.

### Frontend (`CEC/**` React)

**Weaknesses**

-   **No error UI.** If fetch fails, users see the "Loading..." string forever.
-   **No skeleton loader.** Same "Loading..." string across all three routes.
-   **No search / filter / pagination.** Once crew count grows, list becomes
    unusable.
-   **Manual state.** `useState` + `useEffect` fetch. Replace with **TanStack
    Query** — caching, retries, background revalidation for free.
-   **Sort mutates local state.** After sorting, original order is lost until
    refetch. Keep a sorted view over immutable data.
-   **`ASCII_BG` is expensive.** Canvas repaints every frame at grid resolution.
    On 4K + 144Hz it burns CPU. Alternatives listed in Part III.
-   **No route-level code splitting.** All three crew screens ship in the
    initial bundle. Use `React.lazy` + Suspense.
-   **No accessibility pass.** Missing `aria-*`, focus trap on modals (when they
    arrive), keyboard navigation on cards.
-   **Client-side sanitize via DOMPurify.** Fine, but data comes from our own DB
    — sanitize at ingest, not at render. Faster.

### Architecture / tooling

-   **`react-scripts` is deprecated.** Migrate to **Vite** — faster HMR,
    first-class TS/ESM, ~1/10 the config.
-   **TypeScript 4.9** on the frontend. Bump to 5.x, flip `"jsx": "react"` →
    `"react-jsx"`, drop the `import React` boilerplate.
-   **Two tsconfigs implied but only one exists.** Split into
    `tsconfig.frontend.json` and `tsconfig.backend.json` — different targets,
    different libs.
-   **No CI.** GitHub Actions badge in README points to workflows — verify they
    run. Add: lint, typecheck, unit test, build.
-   **No pre-commit hooks.** Add Husky + lint-staged to run Prettier/ESLint on
    changed files.

---

## Part II — Turning this into a real Dead Space universe API

Current scope: three crew types on one ship. The universe is much bigger. Below
is the target domain.

### 2.1 Resources to model

Prioritized by lore centrality:

1. **Ships** — USG Ishimura, USG O'Bannon, USG Kellion, USM Valor, USG Terra
   Nova, Sprawl station, CMS Roanoke. Fields: registry, class (Planet Cracker /
   Combat Frigate / Medical / Research), commissioned, crew capacity, current
   status.

2. **Crew** — already partially modeled. Extend with clearance level, assigned
   ship, current department, unitologist flag.

3. **Necromorphs** — Slasher, Lurker, Leaper, Brute, Guardian, Infector,
   Divider, Pack, Twitcher, Pregnant, Wheezer, Exploder, Swarmer, Puker, Waster,
   Cyst, Tripod, Hive Mind, Nexus, Ubermorph. Fields: threat tier, weak points,
   mobility, resistances, first observed.

4. **Weapons** — Plasma Cutter, Line Gun, Pulse Rifle, Ripper, Contact Beam,
   Flamethrower, Force Gun, Detonator, Javelin Gun, Rivet Gun, Seeker Rifle.
   Fields: tier, damage type, secondary fire, tool origin
   (mining/military/salvage), obtained-in.

5. **RIG suits** — Level 1–6, Advanced, Elite, Vintage, Hazard, Legionary, Riot,
   Arctic, Elite Advanced. Fields: armor rating, inventory slots, health bonus,
   environment (vacuum/toxic/thermal), unlock chapter.

6. **Markers** — Red Marker, Black Marker, replicated copies. Fields:
   designation, origin, current location, active/dormant, incidents linked.

7. **Locations** — Aegis VII, Titan Station, Tau Volantis, Earth, Roanoke
   system, Uxor. Fields: type (planet/station/moon/ship), gravity, atmosphere,
   current status (habitable/quarantined/destroyed).

8. **Incidents** — Aegis VII outbreak, Ishimura outbreak, Sprawl outbreak, Tau
   Volantis discovery. Fields: date, location ref, ships involved, marker ref,
   casualties, containment status.

9. **Factions** — CEC, EarthGov, Sovereign Colonies, Unitology Church, S.C.A.F.
   Fields: affiliation, allegiance, era active.

10. **Missions / Chapters** — canonical story chapters (DS1 12 ch, DS2 15 ch,
    DS3 19 ch). Fields: ship, location, objective, chapter #, game.

11. **Timeline** — canonical events keyed by year. Query by date range.

### 2.2 API surface

REST:

```-
GET    /api/ships                     ?class=&status=
GET    /api/ships/:id
GET    /api/ships/:id/crew            paginated
POST   /api/ships                     admin
PATCH  /api/ships/:id                 admin

GET    /api/crew                      ?ship=&role=&clearance=&q=
GET    /api/crew/:id
POST   /api/crew                      officer+
PATCH  /api/crew/:id
DELETE /api/crew/:id                  admin

GET    /api/necromorphs               ?tier=&mobility=
GET    /api/necromorphs/:id

GET    /api/weapons                   ?tier=&type=
GET    /api/rigs                      ?level=
GET    /api/markers
GET    /api/locations
GET    /api/incidents                 ?year=&location=
GET    /api/factions

GET    /api/timeline                  ?from=&to=
GET    /api/search?q=                 cross-resource
GET    /api/stats                     aggregations (crew per ship, deaths per incident)

GET    /api/health
GET    /api/docs                      swagger-ui
```

Optional (later):

-   **GraphQL** layer over the same models — clients want
    `crew → ship → incidents` in one round-trip. Apollo Server on top of
    Mongoose.
-   **WebSocket** channel `/ws/rig-telemetry` — streams live "crew status"
    updates every N seconds (health, oxygen, location on ship deck). Faked from
    DB for atmosphere.
-   **Server-sent events** for incident feed.

### 2.3 Data ingest

-   Seed script `npm run seed` that inserts canonical crew, ships, necromorphs,
    weapons from JSON fixtures in `CEC/seeds/`.
-   Fixtures under version control — treat lore as data, not code.

### 2.4 Auth model

-   JWT with roles: `guest`, `crew`, `officer`, `admin`.
-   Public reads (necromorph list, weapons, timeline) — no auth.
-   Crew reads (own records) — `crew`.
-   Mutations — `officer`.
-   Destructive ops — `admin`.
-   Rotate secrets via AWS Secrets Manager in prod.

---

## Part III — ASCII background alternatives

Ranked by fit to Dead Space and cost.

| Option                                                           | Vibe fit | Perf           | Effort | Notes                                                                   |
| ---------------------------------------------------------------- | -------- | -------------- | ------ | ----------------------------------------------------------------------- |
| **Marker glyph SVG pattern** (rotating, pulsing)                 | ★★★★★    | Low CPU        | S      | Directly canonical. SVG symbols repeat, slow rotate + brightness pulse. |
| **Static Ishimura schematic (SVG)** with blinking damage markers | ★★★★★    | ~0             | M      | Uses HUD blueprint style. Great as bg for landing/nav.                  |
| **Starfield via three.js / react-three-fiber**                   | ★★★★     | Medium         | M      | Parallax stars, occasional debris. Feels like deep space.               |
| **Ishimura wireframe orbit** (r3f)                               | ★★★★★    | Medium         | L      | 3D low-poly Ishimura slowly rotating. Signature look.                   |
| **WebGL shader (fragment) — nebula noise**                       | ★★★★     | Low GPU        | M      | GLSL `snoise` for organic red/black plasma. `react-shader-canvas`.      |
| **CSS-only animated gradient + film grain**                      | ★★★      | Very low       | XS     | Cheapest option. `background: conic/radial + noise SVG overlay`.        |
| **Circular radar sweep overlay**                                 | ★★★★     | Low            | S      | HUD scanner rotating over darkened bg. Perfect for corners.             |
| **DNA / Marker double-helix Canvas**                             | ★★★★★    | Low            | M      | Marker is literally a helix. Rotate + glow. Iconic.                     |
| **Particle system (debris)**                                     | ★★★      | Medium         | S      | Slow drifting dust + occasional wreckage.                               |
| **Video loop of deep space**                                     | ★★       | High bandwidth | XS     | Not recommended. Heavy, poor accessibility.                             |

**Recommendation:** replace `ASCII_BG` with **Ishimura wireframe orbit**
(`@react-three/fiber` + `drei`) for the main hub, plus a **Marker glyph SVG
overlay** with low opacity on top. Two layers, both canonical, both cheap.

Fallback if 3D is too heavy: **CSS-only gradient + film grain + circular
scanner** — nearly free, still atmospheric.

---

## Part IV — Immediate optimizations (this sprint)

Order matters. Small first.

1. **Fix error envelope.** `miner.controller.ts:13` return JSON, not text. Match
   Swagger.
2. **Add `/api/health`.** `{ status: 'ok', uptime, mongo: connected }`.
3. **Serve Swagger UI.**
   `app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec))`.
4. **Loading skeleton + error UI.** Replace "Loading..." with animated HUD
   skeletons; show retry button on error.
5. **TanStack Query.** Replace manual fetch hooks. Free caching + retries.
6. **`React.lazy` routes.** Split Miners/Engineers/Scientists into their own
   chunks.
7. **Pagination.** `GET /api/miners?page=1&limit=50`. Server: `.skip().limit()`.
8. **Tailwind adoption.** Migrate one component (CrewComponent card) from SCSS
   to Tailwind classes. Prove pattern.
9. **Vite migration.** Full webpack → Vite. Halves dev-server startup, gets
   React Fast Refresh out of the box.
10. **Husky + lint-staged.** `pre-commit`: prettier + eslint on staged.

---

## Part V — File map (target architecture)

Target after Parts I–IV land. Legend: `[new]`, `[refactored]`, `[unchanged]`.

```-
DS_API/
├── .env                                              # unchanged
├── .env.example                                      # [new] template, no secrets
├── .github/workflows/                                # [new]
│   ├── ci.yml                                        #   lint + typecheck + test on PR
│   └── deploy.yml                                    #   (already exists — verify)
├── .husky/                                           # [new]
│   └── pre-commit                                    #   lint-staged runner
├── vite.config.ts                                    # [new] replaces webpack.config.js
├── tsconfig.json                                     # [refactored] shared base
├── tsconfig.frontend.json                            # [new] jsx: react-jsx, DOM
├── tsconfig.backend.json                             # [new] node types, commonjs
├── package.json                                      # [refactored] scripts: dev, build, test, seed
├── postcss.config.js                                 # unchanged (Tailwind)
├── ROADMAP.md                                        # this file
├── CLAUDE.md                                         # unchanged
├── README.md                                         # unchanged
│
├── src/                                              # [refactored] flat frontend root (Vite)
│   ├── main.tsx                                      #   entry (was CEC/src/index.js)
│   ├── App.tsx
│   ├── router.tsx                                    #   React Router config, lazy routes
│   ├── styles/
│   │   ├── tailwind.css                              #   @import 'tailwindcss' + @theme
│   │   └── globals.css                               #   scanlines, vignette, fonts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Hub.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Nav.tsx
│   │   ├── ui/                                       #   design system (shadcn-style)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   └── CrosshairCursor.tsx
│   │   ├── background/
│   │   │   ├── IshimuraOrbit.tsx                     #   r3f wireframe (replaces ASCII_BG)
│   │   │   └── MarkerGlyphs.tsx                      #   SVG overlay
│   │   └── crew/
│   │       ├── CrewList.tsx
│   │       ├── CrewCard.tsx
│   │       ├── CrewFilters.tsx
│   │       └── CrewSorters.tsx
│   ├── features/                                     #   per-domain hooks + types
│   │   ├── crew/
│   │   │   ├── api.ts                                #   TanStack Query hooks
│   │   │   └── types.ts
│   │   ├── ships/
│   │   ├── necromorphs/
│   │   ├── weapons/
│   │   ├── rigs/
│   │   ├── markers/
│   │   ├── locations/
│   │   ├── incidents/
│   │   ├── factions/
│   │   ├── missions/
│   │   └── timeline/
│   ├── lib/
│   │   ├── queryClient.ts                            #   TanStack Query instance
│   │   ├── api.ts                                    #   fetch wrapper w/ error envelope
│   │   └── zod/                                      #   response schemas
│   └── assets/
│       ├── fonts/                                    #   self-host Chakra Petch etc.
│       └── images/
│
├── server/                                           # [refactored] flat backend (was CEC/ships/USG_Ishimura/bridge)
│   ├── index.ts                                      #   Express bootstrap (was server.js)
│   ├── pipe.ts                                       #   middleware chain
│   ├── env.ts                                        #   zod-validated process.env
│   ├── db.ts                                         #   mongoose connect + retry
│   ├── auth/                                         # [new]
│   │   ├── jwt.ts
│   │   └── middleware.ts
│   ├── middleware/
│   │   ├── errorHandler.ts                           #   unified JSON envelope
│   │   ├── validate.ts                               #   zod → 400
│   │   └── rateLimit.ts                              #   tiered
│   ├── routes/
│   │   ├── index.ts
│   │   ├── health.route.ts                           # [new]
│   │   ├── docs.route.ts                             # [new] swagger-ui-express
│   │   ├── crew.route.ts                             #   was miners/engineers/scientists — unified w/ ?role=
│   │   ├── ships.route.ts                            # [new]
│   │   ├── necromorphs.route.ts                      # [new]
│   │   ├── weapons.route.ts                          # [new]
│   │   ├── rigs.route.ts                             # [new]
│   │   ├── markers.route.ts                          # [new]
│   │   ├── locations.route.ts                        # [new]
│   │   ├── incidents.route.ts                        # [new]
│   │   ├── factions.route.ts                         # [new]
│   │   ├── missions.route.ts                         # [new]
│   │   ├── timeline.route.ts                         # [new]
│   │   └── search.route.ts                           # [new] cross-resource text search
│   ├── controllers/
│   │   ├── crew.controller.ts
│   │   ├── ships.controller.ts
│   │   └── ...                                       #   one per resource
│   ├── models/
│   │   ├── crew.model.ts                             #   discriminated (miner/engineer/scientist)
│   │   ├── ship.model.ts
│   │   ├── necromorph.model.ts
│   │   ├── weapon.model.ts
│   │   ├── rig.model.ts
│   │   ├── marker.model.ts
│   │   ├── location.model.ts
│   │   ├── incident.model.ts
│   │   ├── faction.model.ts
│   │   ├── mission.model.ts
│   │   └── timelineEvent.model.ts
│   ├── schemas/                                      #   zod (shared with FE via workspace)
│   │   ├── crew.zod.ts
│   │   ├── ship.zod.ts
│   │   └── ...
│   ├── services/                                     # [new] business logic layer
│   │   ├── searchService.ts
│   │   ├── statsService.ts
│   │   └── seedService.ts
│   ├── ws/                                           # [new] optional
│   │   └── rigTelemetry.ts
│   └── docs/
│       └── openapi.yaml                              #   moved + expanded
│
├── seeds/                                            # [new] canonical DS lore as JSON
│   ├── ships.json
│   ├── crew.json
│   ├── necromorphs.json
│   ├── weapons.json
│   ├── rigs.json
│   ├── markers.json
│   ├── locations.json
│   ├── incidents.json
│   ├── factions.json
│   ├── missions.json
│   └── timeline.json
│
└── tests/                                            # [new]
    ├── unit/
    │   ├── controllers/
    │   └── services/
    ├── integration/
    │   └── routes/                                   #   supertest against real Mongo (test container)
    └── e2e/
        └── smoke.spec.ts                             #   Playwright — happy paths
```

Notes on the target layout:

-   No more `CEC/archive/**`. Vite builds the frontend directly from `src/`.
    Backend runs from TypeScript via `tsx` (no manual compile step, watch is
    instant).
-   `CEC/` prefix goes away entirely. `CEC` becomes a namespace in code
    (`import { crewRoutes } from 'server/routes/crew.route'`), not a folder
    ancestor.
-   `USG_Ishimura` becomes data, not a directory. The API can serve multiple
    ships.
-   One controller per resource, one route file per resource. No more
    per-crew-type routes.
-   Zod schemas live once, imported by both server and client. Response types
    are auto-inferred.

---

## Part VI — Milestones

Bite-sized. Each one shippable independently. `✓` = done, `~` = in progress.

**Progress:** 6 milestones landed (M1, M2, M2.5, M2.6, M2.7, M2.8). 6 ahead
(M3–M8). M2 is 90 % — only the per-component Tailwind migration is still
pending; the framework is wired end-to-end.

-   **M1 — Foundation cleanup** ✓

    -   ✓ Unified error envelope (`bridge/utils/errorEnvelope.ts`) + `ApiError`
        class
    -   ✓ `GET /api/health` — Mongo readiness + uptime
    -   ✓ Swagger UI mounted at `/api/docs`; raw spec at `/api/openapi.json`
    -   ✓ `logAllData()` removed from boot — server starts instantly
    -   ✓ TypeScript bumped 4.9 → 5.x; `"jsx": "react-jsx"` (drop `import React`
        boilerplate)
    -   ✓ `react-scripts` removed (conflicted with TS 5)

-   **M2 — Frontend UX pass** ~ (Tailwind migration pending)

    -   ✓ `CrewSkeleton` + `ErrorState` HUD components with faction colours
    -   ✓ TanStack Query 5 wired via `CEC/lib/queryClient.ts`, hooks in
        `crew/hooks/useCrew.ts`
    -   ✓ Route-level code splitting: `React.lazy` + `Suspense` for
        Miners/Engineers/Scientists/RotationGraph
    -   ✓ Pagination on all crew endpoints: `?page=1&limit=50` →
        `{items, page, limit, total}`
    -   ✓ Three-layer cache: TanStack Query (client) + `Cache-Control` (HTTP) +
        `lru-cache` (server)
    -   ⋯ Tailwind CSS 4 wired end-to-end; per-component migration still ahead

-   **M2.5 — Domain model + OOP hardening** ✓

    -   ✓ `CEC.interface.ts` split into value objects (`Role`, `Experience`,
        `Certification`, `Equipment`, `Mission`) and aggregate `CrewMember`
    -   ✓ All fields `readonly`; single-argument `CrewPrototype` constructor
        with typed business methods
    -   ✓ `Model<CrewMember>` in every model file (no more `any`)
    -   ✓ `crew.helper.ts` uses `HydratedDocument<CrewMember>` and returns typed
        `CrewPrototype[]`
    -   ✓ Legacy `IshimuraDB.ts` cleaned up: error envelope, typed handlers, env
        guard

-   **M2.6 — Live crew rotation** ✓

    -   ✓ Deterministic slot-based roulette (`bridge/utils/mermaidGraph.ts`) —
        same slot = same assignments across clients
    -   ✓ Task pools: routine per deck + officer non-routine (60 % bias for rank
        ≥ 4)
    -   ✓ Off-duty edges for inactive crew and 20 % lottery for junior crew
    -   ✓ Mermaid theme, per-edge `linkStyle` colouring, in-graph legend
    -   ✓ Endpoints: `/api/rotations`, `/api/rotations/mermaid`,
        `/api/rotations/slot`
    -   ✓ Frontend `RotationGraph.tsx` — slot picker, countdown to next
        rotation, responsive SVG (100 % width)
    -   ✓ Snapshot script `npm run gen:rotation` — writes
        `Ishimura_crew_rotation.mmd` and injects mermaid block into README
        between markers

-   **M2.7 — CI/CD lint hardening** ✓

    -   ✓ Root cause of the failing `deploy.yml` badge: `globals@14` (transitive
        via `eslint@9.14`) ships an entry `AudioWorkletGlobalScope` with a
        trailing space, and ESLint 9.14 rejects it up front. Pinned
        `globals@^15.15.0` as a direct devDependency so the whitespace-fixed
        list is used.
    -   ✓ `eslint.config.js` restructured into three flat blocks: 1. Backend
        `.ts` — typed lint via `tsconfig.json`. 2. Frontend `.tsx / .jsx / .js`
        and `ASCII_BG.tsx` — parser-only (babel transforms them at build time;
        no TS project required). 3. Node scripts (`scripts/**`, `*.config.js`) —
        node-only globals, React rules disabled, `no-console` off.
    -   ✓ Global ignore list added for `CEC/archive/**`, `node_modules/**`,
        compiled `.css` output — prevents lint from crawling build artefacts.
    -   ✓ `tsconfig.json` `include` narrowed to backend `.ts` only; `.tsx` stays
        outside tsc, which matches how webpack + babel handle the frontend.
    -   ✓ Legacy `eslintConfig` block (with `react-app` / `react-app/jest`
        presets) removed from `package.json` — it was dead weight left over from
        CRA and shadowed the flat config in some editors.
    -   ✓ Real lint errors fixed as a side-effect: `consistent-return` in
        `bridge/utils/cache.ts` and `RotationGraph.tsx` (explicit
        `return     undefined` in early exits), plus `no-undef: 'React'` in
        `Hub.tsx` (switched to named `type FC` import — `React.FC` is not in
        scope with `jsx: react-jsx`).
    -   ✓ `npm run lint:check` now exits `0` locally (12 warnings remain, all
        `no-console`; CI treats them as non-fatal).

-   **M2.8 — Test harness + pre-commit + code owners** ✓

    -   ✓ Jest wired via `ts-jest`; new `jest.config.js` targets `tests/**` with
        an inline tsconfig (CommonJS + `jsx: react-jsx`) so backend and frontend
        utils are testable without touching the build config.
    -   ✓ 25 smoke tests across four suites covering the big pure processes:
        -   `errorEnvelope.test.ts` — envelope shape + prod message masking +
            4xx passthrough.
        -   `pagination.test.ts` — default/parse/clamp behaviour of
            `?page&limit`.
        -   `cache.test.ts` — LRU middleware MISS→HIT transition + prefix
            invalidation.
        -   `mermaidGraph.test.ts` — slot determinism, inactive → off-duty,
            officer bias distribution, chief label selection.
    -   ✓ Husky pre-commit hook (`.husky/pre-commit`) runs `lint-staged`
        (auto-fix + prettier on staged files) then `npm test` — commit blocks on
        any red.
    -   ✓ `lint-staged` config in `package.json` — `.{js,jsx,ts,tsx}` go through
        `eslint --fix` + `prettier --write`; docs/config through prettier only.
    -   ✓ `.prettierignore` added so prettier stops reformatting `CODEOWNERS`,
        `Ishimura_crew_rotation.mmd`, and other generated files.
    -   ✓ `.github/CODEOWNERS` — every path in the repo requires review by
        `@ChewBaccaYeti` (default `*` line plus explicit ownership for
        `.github/`, `.husky/`, backend `bridge/`, package/tsconfig/webpack).

-   **M3 — Build tool migration**

    -   Vite replaces webpack + `react-scripts`
    -   Directory flatten (`CEC/` → `src/` + `server/`)
    -   Backend runs via `tsx watch` — no `archive/`

-   **M4 — Domain expansion phase 1**

    -   Ships, Necromorphs, Weapons: models, routes, seeds
    -   Cross-resource search endpoint

-   **M5 — Domain expansion phase 2**

    -   RIGs, Markers, Locations, Incidents, Factions, Missions, Timeline

-   **M6 — Auth + hardening**

    -   JWT + role middleware
    -   Tiered rate limiting
    -   Zod validation on all mutations
    -   Test suite (Vitest + supertest + Playwright)
    -   GitHub Actions CI

-   **M7 — Background overhaul**

    -   r3f Ishimura wireframe + Marker glyph SVG overlay
    -   Remove `ASCII_BG.tsx`

-   **M8 — Realtime (optional)**
    -   WebSocket RIG telemetry
    -   SSE incident feed
    -   GraphQL gateway
