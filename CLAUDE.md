# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

CEC / USG Ishimura crew database. Themed after _Dead Space_: three crew types
(Miners, Engineers, Scientists) stored in MongoDB Atlas, served by Express,
rendered by a React SPA. Personal learning project — treat it as such: prefer
teaching over silent fixes.

## Ports (critical — do not swap)

`.env` variables:

- `APP_PORT=3842` — Express API (backend)
- `SERVER_PORT=5376` — webpack-dev-server (frontend UI)

The API listens on `APP_PORT`. The dev server listens on `SERVER_PORT`.
`webpack.config.js` `devServer.proxy` forwards `/api/*` from `SERVER_PORT` →
`APP_PORT`. Swapping the two breaks the proxy and yields HTTP 504 (proxy hits
the dev server itself, no `/api/*` route exists there).

After editing `.env`, restart every process — `dotenv` reads once at startup.

## Architecture (mental model)

``` -
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

``` -
CEC/
├── Hub.tsx                              # React root: routes + nav
├── src/                                 # React entry (index.js, App.js)
├── public/                              # static assets + index.html template
├── styles/                              # SCSS → compiled to styles.css
├── ships/USG_Ishimura/
│   ├── IshimuraDB.ts                    # legacy DB entry (see `npm run RIG`)
│   ├── bridge/
│   │   ├── server/server.js             # Express bootstrap, mongoose.connect, app.listen(APP_PORT)
│   │   ├── pipe/pipe.js                 # middleware chain: helmet, cors, rate-limit, /api router
│   │   └── routes/
│   │       ├── index.routes.ts          # mounts miners/engineers/scientists
│   │       ├── miners.route.ts
│   │       ├── engineers.route.ts
│   │       └── scientists.route.ts
│   └── crew/
│       ├── CEC.schema.ts                # base Mongoose schema (name, rank, role, cert, equipment...)
│       ├── CEC.interface.ts             # TS interfaces
│       ├── models/                      # Mongoose models (Miner, Engineer, Scientist)
│       ├── controllers/                 # controllers return JSON via res.json
│       ├── components/                  # React: CrewComponent + Miners/Engineers/Scientists
│       └── scripts/
│           ├── fetchers/                # fetch('/api/<role>') per crew type
│           └── helpers/                 # renderCertifications, sorters, etc.
└── archive/                             # tsc build output — DO NOT edit by hand
```

`CEC/archive/**` is the TypeScript compile target (see `compile-ts` script).
Never edit files under `archive/` directly — they get overwritten. Always edit
the `.ts` source and let `npm run compile` or `watch-ts` regenerate.

## Scripts (`package.json`)

- `npm run deck` — full dev: `compile` + Express (`server`) + webpack
    (`crew`) + `watch` in parallel. **Use this for local dev.**
- `npm run deck:override` — same but `--kill-others`; one crash kills all.
- `npm run start` — just server + crew, no compile/watch (assumes `archive/`
    is fresh).
- `npm run server` — nodemon on the compiled `server.js` (API only).
- `npm run crew` — webpack dev server (UI only).
- `npm run compile` — tsc + sass, one-shot.
- `npm run watch` — tsc + sass watchers.
- `npm run build` — production webpack bundle to `CEC/archive/dist`.
- `npm run lint` / `lint:check` / `prettier` / `format` — code quality.
- `npm test` — Jest.

## Environment variables (`.env`)

Required (server throws on missing):

- `MONGO_CEC_ADMIN` — Mongo username
- `MONGO_CEC_PASS` — Mongo password
- `MONGO_CEC_CONN` — Atlas cluster subdomain (used in both connection string
    and `appName`)
- `MONGO_CEC_DB` — database name
- `APP_PORT` — Express port (default working value: `3842`)
- `SERVER_PORT` — webpack dev server port (default working value: `5376`)

Optional:

- `ALLOWED_ORIGINS` — comma-separated CORS origins. Falls back to
    `http://localhost:3000`, which does **not** include the current dev UI
    (`5376`). If direct (non-proxied) fetch from the UI is ever needed, add
    `http://localhost:5376`. With the proxy in place, CORS is not exercised —
    requests originate same-origin from the UI's perspective.

## Common failure modes

- **`Unexpected token '<' ... not valid JSON`** in `fetch*.js`: the proxy is
    broken or missing. Response is `index.html` from `historyApiFallback`. Check
    `webpack.config.js` `devServer.proxy` target =
    `` `http://localhost:${process.env.APP_PORT}` `` (template literal +
    `process.env.`).
- **HTTP 504 on `/api/*`**: proxy target points at an unreachable / wrong port
    (often the UI port itself). Fix `APP_PORT` and restart.
- **Old port still in use after `.env` edit**: existing process cached env
    vars. Kill node processes and re-run `npm run deck`.
- **Data appears in server console but not in UI**: `server.js`'s
    `logAllData()` runs once on startup — that is the console log. HTTP
    endpoints are separate. If UI is empty, the fetch/proxy path is the issue,
    not the DB.
- **`req.body` or types break after editing TS**: forgot to recompile.
    `watch-ts` should be running (via `deck`) — if not, run `npm run compile`.

## Conventions

- Backend source is TypeScript in `CEC/ships/USG_Ishimura/**`; the compiled
    JavaScript lives under `CEC/archive/**`. Server scripts (`server`, `RIG`)
    run the compiled files, not the source.
- Frontend is a mix: `Hub.tsx` (TS), components in `.jsx`, fetchers in `.js`.
    Keep new frontend files consistent with the file they live next to.
- API paths are relative in fetchers (`fetch('/api/miners')`) — never hardcode
    `http://localhost:APP_PORT`. The dev proxy handles the port; production
    would front both behind the same origin.
- Sanitize HTML output through `DOMPurify` (see `CrewComponent.jsx`). Never
    bypass it for dynamic content.
- Helmet + rate-limit + CORS are wired in `pipe.js`. Don't disable them for
    local convenience — fix the config instead.
- Secrets stay in `.env`. Never commit real credentials or paste them into
    chat/logs/code.

## Working style for this repo

The owner is learning JavaScript / web dev and wants to write code themselves.
Default behavior:

- Explain the _why_ before proposing edits.
- Point to file:line, describe the failing mechanism, propose a targeted fix.
- Prefer letting the user attempt the fix and reviewing their attempt over
    pasting finished code.
- When something must be shown as code, keep the diff minimal.
