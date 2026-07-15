# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

CEC / USG Ishimura crew database. Themed after _Dead Space_: three crew types
(Miners, Engineers, Scientists) stored in MongoDB Atlas, served by Express,
rendered by a React SPA. Personal learning project — treat it as such: prefer
teaching over silent fixes.

## Ports (critical — do not swap)

`.env` variables:

-   `APP_PORT=3842` — Express API (backend)
-   `SERVER_PORT=5376` — webpack-dev-server (frontend UI)

The API listens on `APP_PORT`. The dev server listens on `SERVER_PORT`.
`webpack.config.js` `devServer.proxy` forwards `/api/*` from `SERVER_PORT` →
`APP_PORT`. Swapping the two breaks the proxy and yields HTTP 504 (proxy hits
the dev server itself, no `/api/*` route exists there).

After editing `.env`, restart every process — `dotenv` reads once at startup.

## Architecture (mental model)

```-
Browser ── http://localhost:5376 (SERVER_PORT / webpack)
             │
             ├─ static bundle.js + index.html      (webpack devServer)
             │
             └─ fetch('/api/*') ──proxy──▶ http://localhost:3842/api/* (APP_PORT / Express)
                                                    │
                                                    ├─ /api/miners       ─▶ miner.controller ─▶ Miner.find()
                                                    ├─ /api/engineers    ─▶ engineer.controller
                                                    └─ /api/scientists   ─▶ scientist.controller
                                                                                │
                                                                                └─▶ MongoDB Atlas
```

Everything under `/api` is served by Express
(`CEC/archive/ships/USG_Ishimura/bridge/pipe/pipe.js:79`). Anything else falls
through to `historyApiFallback: true` and returns `index.html` — that is exactly
why a bad proxy target produces `Unexpected token '<'` in JSON.parse.

## Layout

```-
CEC/
├── Hub.tsx                              # React root: routes + nav
├── src/                                 # React entry (index.js, App.js)
├── lib/                                 # queryClient.ts + api.ts (fetch wrapper)
├── public/                              # static assets + index.html template
├── styles/                              # tailwind.css + SCSS → compiled styles.css
├── ships/USG_Ishimura/
│   ├── IshimuraDB.ts                    # legacy Aegis entry (npm run RIG)
│   ├── bridge/
│   │   ├── server/server.ts             # Express bootstrap, mongoose.connect, app.listen(APP_PORT)
│   │   ├── pipe/pipe.ts                 # middleware chain: helmet, cors, rate-limit, /api router
│   │   ├── routes/
│   │   │   ├── index.routes.ts          # mounts every resource under /api
│   │   │   ├── miners.route.ts          # + cacheMiddleware
│   │   │   ├── engineers.route.ts
│   │   │   ├── scientists.route.ts
│   │   │   ├── rotations.route.ts       # /api/rotations, /rotations/mermaid, /rotations/slot
│   │   │   ├── health.route.ts          # /api/health
│   │   │   └── docs.route.ts            # /api/docs + /api/openapi.json
│   │   └── utils/
│   │       ├── errorEnvelope.ts         # ApiError + errorHandler + notFoundHandler
│   │       ├── cache.ts                 # lru-cache middleware + invalidator
│   │       ├── pagination.ts            # ?page=&limit= → { items, page, limit, total }
│   │       └── mermaidGraph.ts          # buildRotationMermaid() + slot roulette
│   └── crew/
│       ├── CEC.schema.ts                # base Mongoose schema
│       ├── CEC.interface.ts             # readonly value objects + CrewPrototype class
│       ├── crew.helper.ts               # processAndLogCrew (typed HydratedDocument)
│       ├── models/                      # Model<CrewMember> — Miner/Engineer/Scientist
│       ├── controllers/                 # (_req, res, next) → paginate(Model, req)
│       └── components/
│           ├── CrewComponent.jsx        # uses useCrew() hook
│           ├── Miners.jsx / Engineers.jsx / Scientists.jsx
│           ├── RotationGraph.tsx        # mermaid renderer + slot picker + countdown
│           ├── CrosshairCursor.tsx      # HUD cursor overlay
│           ├── hooks/useCrew.ts         # TanStack Query hook
│           └── ui/
│               ├── CrewSkeleton.tsx     # HUD skeleton loader
│               └── ErrorState.tsx       # HUD alert with retry
└── archive/                             # tsc build output — DO NOT edit by hand

scripts/
└── gen-rotation-snapshot.ts             # regenerates Ishimura_crew_rotation.mmd + README block
```

`CEC/archive/**` is the TypeScript compile target (see `compile-ts` script).
Never edit files under `archive/` directly — they get overwritten. Always edit
the `.ts` source and let `npm run compile` or `watch-ts` regenerate.

## Scripts (`package.json`)

-   `npm run deck` — full dev: `compile` + Express (`server`) + webpack
    (`crew`) + `watch` in parallel. **Use this for local dev.**
-   `npm run deck:override` — same but `--kill-others`; one crash kills all.
-   `npm run start` — just server + crew, no compile/watch (assumes `archive/`
    is fresh).
-   `npm run server` — nodemon on the compiled `server.js` (API only).
-   `npm run crew` — webpack dev server (UI only).
-   `npm run compile` — tsc + sass, one-shot.
-   `npm run typecheck` — full-project type check via `tsconfig.json` (frontend
    `.tsx/.jsx` + backend `.ts`), no emit. Use before pushing to catch what the
    backend-only `compile-ts` misses.
-   `npm run watch` — tsc + sass watchers.
-   `npm run build` — production webpack bundle to `CEC/archive/dist`.
-   `npm run lint` / `lint:check` / `prettier` / `format` — code quality.
-   `npm run gen:rotation` — regenerates `Ishimura_crew_rotation.mmd` and
    injects the current mermaid snapshot into `README.md` between
    `<!-- ROTATION-SNAPSHOT:START -->` and `<!-- ROTATION-SNAPSHOT:END -->`.
-   `npm test` — Jest.

## API endpoints

All under `/api`. Every error uses the same envelope
(`errorEnvelope.buildErrorEnvelope`) —
`{ error: { code, message }, endpoint, status, timestamp }`.

-   `GET /api/health` — liveness + Mongo readiness. 503 when Mongo not
    `connected`.
-   `GET /api/docs` — Swagger UI (from `CEC.swagger.yaml`).
-   `GET /api/openapi.json` — raw spec.
-   `GET /api/miners|engineers|scientists?page=1&limit=50` — paginated crew.
    Response shape: `{ items, page, limit, total }`.
-   `GET /api/rotations?slotHours=4` — current slot + JSON assignments.
-   `GET /api/rotations/mermaid?slotHours=4` — mermaid flowchart (`text/plain`).
-   `GET /api/rotations/slot?slotHours=4` — just the slot boundaries.

Caching: `bridge/utils/cache.ts` wraps JSON handlers with an `lru-cache`
(default TTL 60s) and stamps
`Cache-Control: public, max-age=60, stale-while-revalidate=30`. Rotation
endpoints use a shorter TTL (30s) so the roulette stays fresh.

## Domain model

Value objects and the aggregate `CrewMember` live in
`CEC/ships/USG_Ishimura/crew/CEC.interface.ts`. All fields are `readonly` —
mutation goes through Mongoose. Business logic sits on the `CrewPrototype` class
(`isOfficer()`, `isActive()`, `lastCompletedMission()`, `dumpRigData()`). New
crew-related methods should live on the class, not on the interface.

Mongoose models are typed via `Model<CrewMember>`; controllers pass the model to
`paginate(model, req)` (`bridge/utils/pagination.ts`) which returns
`Paginated<CrewMember>`.

## Environment variables (`.env`)

Required (server throws on missing):

-   `MONGO_CEC_ADMIN` — Mongo username
-   `MONGO_CEC_PASS` — Mongo password
-   `MONGO_CEC_CONN` — Atlas cluster subdomain (used in both connection string
    and `appName`)
-   `MONGO_CEC_DB` — database name
-   `APP_PORT` — Express port (default working value: `3842`)
-   `SERVER_PORT` — webpack dev server port (default working value: `5376`)

Optional:

-   `ALLOWED_ORIGINS` — comma-separated CORS origins. Falls back to
    `http://localhost:3000`, which does **not** include the current dev UI
    (`5376`). If direct (non-proxied) fetch from the UI is ever needed, add
    `http://localhost:5376`. With the proxy in place, CORS is not exercised —
    requests originate same-origin from the UI's perspective.

## Common failure modes

-   **`Unexpected token '<' ... not valid JSON`** in `fetch*.js`: the proxy is
    broken or missing. Response is `index.html` from `historyApiFallback`. Check
    `webpack.config.js` `devServer.proxy` target =
    `` `http://localhost:${process.env.APP_PORT}` `` (template literal +
    `process.env.`).
-   **HTTP 504 on `/api/*`**: proxy target points at an unreachable / wrong port
    (often the UI port itself). Fix `APP_PORT` and restart.
-   **Old port still in use after `.env` edit**: existing process cached env
    vars. Kill node processes and re-run `npm run deck`.
-   **`req.body` or types break after editing TS**: forgot to recompile.
    `watch-ts` should be running (via `deck`) — if not, run `npm run compile`.
-   **`gen:rotation` fails with `Missing MONGO_CEC_* env vars`**: `.env` not
    populated. Copy from `.env.example` and fill Mongo credentials before
    running the snapshot generator.

## Conventions

-   Backend source is TypeScript in `CEC/ships/USG_Ishimura/**`; the compiled
    JavaScript lives under `CEC/archive/**`. Server scripts (`server`, `RIG`)
    run the compiled files, not the source.
-   Frontend is a mix: `Hub.tsx` (TS), components in `.jsx`, fetchers in `.js`.
    Keep new frontend files consistent with the file they live next to.
-   API paths are relative in fetchers (`fetch('/api/miners')`) — never hardcode
    `http://localhost:APP_PORT`. The dev proxy handles the port; production
    would front both behind the same origin.
-   Sanitize HTML output through `DOMPurify` (see `CrewComponent.jsx`). Never
    bypass it for dynamic content.
-   Helmet + rate-limit + CORS are wired in `pipe.js`. Don't disable them for
    local convenience — fix the config instead.
-   Secrets stay in `.env`. Never commit real credentials or paste them into
    chat/logs/code.

## Working style for this repo

The owner is learning JavaScript / web dev and wants to write code themselves.
Default behavior:

-   Explain the _why_ before proposing edits.
-   Point to file:line, describe the failing mechanism, propose a targeted fix.
-   Prefer letting the user attempt the fix and reviewing their attempt over
    pasting finished code.
-   When something must be shown as code, keep the diff minimal.
