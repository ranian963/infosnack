# PROJECT KNOWLEDGE BASE

**Generated:** 2026-06-07
**Commit:** none yet
**Branch:** main

## OVERVIEW

InfoSnack is a doc-first product scaffold for a FastAPI + Next.js knowledge capture, RAG, digest, and automation app. This checkout currently contains product/API/UI contracts plus local infra, but not the runnable `backend/` or `frontend/` app trees yet.

## STRUCTURE

```text
infosnack/
├── .env.example                 # local env template; copy to .env, never commit real secrets
├── docker-compose.infra.yml      # Postgres 16 + pgvector, Redis 7, MinIO
├── docker/postgres/init/         # first-volume extension init SQL
├── docs/                         # active PRD, screen spec, OpenAPI contract, historical backups
└── AGENTS.md                     # this repo-level operating map
```

Expected after scaffold:

```text
backend/     # FastAPI, SQLAlchemy 2 async, Alembic, Celery
frontend/    # Next.js App Router, React, Tailwind, shadcn/ui
scripts/     # worktree/env helpers
output/      # generated E2E evidence; ignored
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Product meaning | `docs/InfoSnack_PRD_v3.0.md` | Primary requirements and release gates |
| Screen behavior | `docs/InfoSnack_화면설계.md` | Routes, states, UI actions, responsive behavior |
| API contract | `docs/openapi/infosnack-api.yaml` | OpenAPI 3.1 source of truth in this checkout |
| Local infra | `docker-compose.infra.yml` | Only runnable stack piece today |
| DB extensions | `docker/postgres/init/01-extensions.sql` | `vector`, `pg_trgm`, `pgcrypto` |
| Env template | `.env.example` | Ports, CORS, auth, AI provider, E2E seed |
| Historical docs | `docs/backup/` | Reference only; do not treat as current |

## CONTRACT MAP

| Area | Contract |
|------|----------|
| Auth | Backend-owned JWT + HttpOnly cookies + CSRF double-submit; NextAuth is not the plan |
| Permissions | Workspace roles plus enumeration-safe 404/403 policy |
| Secrets | Cipher V2: HKDF-SHA256 + AES-256-GCM + key rotation; raw secrets never surface |
| Search/RAG | pgvector, hybrid search, citations required, golden query fixtures |
| Workers | Redis + Celery worker + one Celery Beat scheduler only |
| Frontend | Next.js 16 App Router, React 19, TypeScript strict, TailwindCSS v4, shadcn/ui |
| State | Server state via TanStack Query, client UI state via Jotai |
| Copy | Korean is source of truth; user-visible strings go through `next-intl` |

## CONVENTIONS

- Scope wording must be explicit: use `전체 출시 범위`, `현재 출시 범위`, `후속 범위`, or `출시 단계`; avoid vague abbreviations like MVP.
- Keep `.env` as the local source of truth. Future `backend/.env` and `frontend/.env.local` should symlink to `../.env`.
- Frontend port, backend port, `CORS_ALLOWED_ORIGINS`, and `NEXT_PUBLIC_API_BASE_URL` move as one set.
- Use `uv` for backend tooling and `pnpm` for frontend tooling once app folders exist.
- OpenAPI-generated types should drive frontend API assumptions; do not invent response shapes.
- New DB tables, enums, indexes, and constraints require Alembic migrations.
- Router code should handle request/response/dependencies; service/repository layers own business logic and DB-specific query composition.
- Use Server Components by default; add `'use client'` only where interaction needs it.
- UI copy changes must update both `messages/ko.json` and `messages/en.json` after scaffold.
- Product UI should use shared InfoSnack/shadcn surfaces and lucide icons; avoid ad hoc shadow/radius/color utilities.

## ANTI-PATTERNS

- Do not commit real `.env`, auth state, screenshots, traces, provider secrets, or generated `output/`.
- Do not expose raw secret, token, cookie, Authorization header, or full provider raw response in logs, audit, admin UI, traces, or E2E screenshots.
- Do not run E2E seed logic when `APP_ENV=production`, even if the env flag is true.
- Do not let Next.js pick an arbitrary dev port and then forget to update backend CORS/API base.
- Do not run multiple Celery Beat schedulers against the same environment.
- Do not make Playwright specs repeatedly log in through the UI; use global setup + `storageState`.
- Do not use direct DB queries in FastAPI routers.
- Do not use offset pagination for large library/search surfaces.
- Do not return large text, embedding fields, or raw extraction in list APIs.
- Do not remove focus rings or rely on color-only status indicators.
- Do not commit directly to `main`; use `feature/`, `fix/`, or `refactor/` branches/worktrees.

## COMMANDS

Runnable now:

```bash
docker compose -f docker-compose.infra.yml up -d
docker compose -f docker-compose.infra.yml ps
```

Planned after scaffold:

```bash
cd backend && uv run uvicorn app.main:app --reload --port 8001 --reload-dir app
cd backend && uv run ruff check .
cd backend && uv run pytest
cd backend && uv run pytest --cov=app --cov-report=term-missing
cd frontend && NEXT_PUBLIC_API_BASE_URL=http://localhost:8001 pnpm dev -- --port 3000
cd frontend && pnpm lint
cd frontend && pnpm lint:i18n
cd frontend && pnpm lint:design-system
cd frontend && pnpm typecheck
cd frontend && pnpm test
cd frontend && pnpm test:coverage
cd frontend && pnpm build
cd frontend && pnpm test:e2e
```

## NOTES

- `AGENTS.md` knowledge files are intended to be versioned; do not add an ignore rule that hides new project guidance.
- The active OpenAPI contract path in this checkout is `docs/openapi/infosnack-api.yaml`.
- Korean doc filenames are stored with decomposed Unicode on disk; use shell completion or `rg --files` rather than hand-typing when scripts are brittle.
- No LSP codemap exists yet because there is no application source tree in this checkout.
