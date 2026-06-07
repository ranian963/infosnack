# InfoSnack

**A self-hostable AI knowledge workspace for capture, RAG search, cited answers, digests, and automation**

[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)]()
[![React](https://img.shields.io/badge/React-19-61dafb.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)]()
[![pgvector](https://img.shields.io/badge/pgvector-enabled-336791.svg)]()
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1-6BA539.svg)]()

InfoSnack is a web application for collecting team knowledge, searching it with hybrid retrieval, generating citation-backed AI answers, and routing useful updates into digests and automations. It combines a Next.js frontend, FastAPI backend, PostgreSQL with pgvector, Redis workers, and MinIO-compatible object storage to turn scattered links, notes, files, and external sources into a searchable workspace.

InfoSnack is built for teams that need reliable knowledge capture without losing source traceability. Every AI answer is designed to include citations, every workspace action respects role-based access controls, and every automation is governed by auditable API contracts rather than hidden one-off scripts.

## Quick Answers

### What is InfoSnack?

InfoSnack is a self-hostable AI knowledge workspace for capturing documents, links, notes, and external knowledge sources, then making them searchable through hybrid keyword and vector retrieval. The product supports RAG answers with citations, workspace permissions, digests, notifications, public sharing, exports, custom webhooks, Google Chat delivery, and admin operations.

### Who is InfoSnack for?

InfoSnack is for product teams, research teams, operators, agencies, and internal-tool groups that repeatedly collect information from many sources and need a trustworthy way to retrieve, summarize, cite, and share that knowledge. It is especially useful when the team needs self-hosted control over data, secrets, permissions, and AI-provider configuration.

### How does InfoSnack make AI answers trustworthy?

InfoSnack treats citations as a core product requirement. Source documents are extracted, normalized, embedded, indexed, and searched inside the active workspace permission boundary. RAG responses are expected to include the evidence used to produce the answer, so users can inspect where a claim came from instead of accepting unsupported generated text.

### How does InfoSnack protect private workspace data?

InfoSnack uses backend-owned JWT authentication, HttpOnly cookies, CSRF double-submit protection, workspace roles, enumeration-safe 404/403 behavior, and encrypted secret storage. Credential and signing-secret values are never returned in list/detail responses and must not appear in logs, audit records, traces, screenshots, or admin screens.

### What can be verified in this repository?

This repository defines the product, API, UI, infrastructure, security, and release-contract expectations for InfoSnack. The current checkout is documentation-first, so the README is written as the completed product introduction while implementation files such as `backend/`, `frontend/`, and local infrastructure are expected to follow the documented structure.

## Project Facts

| Fact | InfoSnack |
| --- | --- |
| Product category | Self-hostable AI knowledge management and RAG workspace |
| Primary use case | Capture, search, cite, digest, share, and automate team knowledge |
| Frontend | Next.js 16 App Router, React 19, TypeScript strict, TailwindCSS v4, shadcn/ui |
| Backend | FastAPI, SQLAlchemy 2 async, Alembic |
| Workers | Celery, Redis, one Celery Beat scheduler per environment |
| Database | PostgreSQL 16 with pgvector, pg_trgm, and pgcrypto |
| Object storage | MinIO-compatible storage |
| API contract | OpenAPI 3.1 |
| Authentication | Backend-owned JWT, HttpOnly cookies, CSRF double-submit |
| Authorization | Workspace roles with enumeration-safe 404/403 policies |
| Secret protection | Cipher V2 using HKDF-SHA256 and AES-256-GCM |
| Localization | Korean source of truth with `next-intl` |

## What Makes InfoSnack Different

- **Citation-first RAG**: InfoSnack is designed around answer traceability. AI responses should point back to the source materials used to produce them.
- **Workspace-safe retrieval**: Search, RAG, sharing, exports, and automation run inside explicit workspace and role boundaries.
- **Hybrid search foundation**: PostgreSQL, pgvector, and trigram search support keyword and semantic retrieval without requiring a separate proprietary search stack.
- **Digest-ready knowledge flow**: Captured material can become daily or weekly updates, not just passive archive entries.
- **Automation with signed delivery**: Custom webhook events use InfoSnack signing headers, while Google Chat targets receive Google Chat-compatible messages.
- **Contract-driven development**: UI behavior, API operations, security expectations, worker behavior, and release gates are kept aligned through product docs and OpenAPI.

## Core Features

### Knowledge Capture

InfoSnack collects links, text snippets, files, extension submissions, API-client submissions, and external knowledge sources. Captured items move through extraction, normalization, embedding, and indexing so they can be searched, summarized, cited, shared, and included in digest workflows.

### Library and Hybrid Search

The library is organized by workspace and designed for large collections. InfoSnack uses cursor pagination for library and search-scale surfaces, combines keyword and vector retrieval, and avoids returning large raw extraction fields or embedding payloads in list APIs.

### RAG Answers with Citations

InfoSnack answers questions from workspace-authorized source material. RAG responses are expected to expose citations and source context so reviewers can verify claims, compare evidence, and reuse the answer in team workflows.

### Digests and Notifications

InfoSnack can summarize newly captured or changed knowledge into scheduled digests. Notifications can be delivered through in-app channels, email-ready flows, or connected external destinations depending on workspace configuration.

### Sharing and Export

InfoSnack supports internal workspace sharing, public share workflows, and export workflows. Shared and exported materials are governed by explicit access policy, expiration, revocation, and audit expectations.

### Webhooks and External Automation

InfoSnack supports `custom` webhook targets and `google_chat_incoming` targets. Custom webhooks send InfoSnack event payloads with HMAC signing, while Google Chat targets send Google Chat-compatible message payloads without InfoSnack HMAC signing.

Signed custom webhook requests include these contract headers:

- `X-InfoSnack-Event-Id`
- `X-InfoSnack-Timestamp`
- `X-InfoSnack-Signature`
- `X-InfoSnack-Retry-Count`

### Admin and Operations

Admin workflows cover workspace management, user and role review, worker status, outgoing delivery failures, audit events, export/share operations, and integration health. Celery workers handle long-running extraction, embedding, digest, notification, and webhook retry tasks outside the user request path.

## Architecture

```text
Browser / Extension / API Client
              |
              v
Next.js App Router Frontend
              |
              v
FastAPI Backend
    |         |          |
    v         v          v
PostgreSQL  Redis     Object Storage
pgvector    Celery    MinIO-compatible
              |
              v
Extraction, Embedding, Digest, Notification, Webhook Workers
```

### Backend Pattern

- **Routers** handle HTTP requests, responses, dependencies, and API-surface concerns.
- **Services** own business logic, permission-aware workflows, and transaction boundaries.
- **Repositories** own database-specific query composition.
- **Alembic migrations** define new tables, enums, indexes, constraints, and schema changes.

### Frontend Pattern

- **Server Components first** for route-level rendering and data boundaries.
- **Client Components only where needed** for interactive controls and local UI state.
- **TanStack Query** for server state, caching, and invalidation.
- **Jotai** for local client-side UI state.
- **next-intl** for localized copy, with Korean as the source language.

## Security Model

InfoSnack is designed for private knowledge workflows where source documents, generated answers, provider keys, webhook secrets, and user sessions must be protected.

| Security area | InfoSnack approach |
| --- | --- |
| Session security | Backend-owned JWT with HttpOnly cookies |
| CSRF protection | Double-submit CSRF token for state-changing cookie-auth requests |
| API clients | Bearer auth with client and scope checks |
| Workspace boundaries | Role-aware authorization and enumeration-safe responses |
| Secret encryption | Cipher V2: HKDF-SHA256 plus AES-256-GCM |
| Webhook signing | HMAC signing for custom webhook targets |
| Sensitive logging | No raw secrets, cookies, tokens, auth headers, object keys, or provider raw responses |
| E2E safeguards | Seed logic must never run when `APP_ENV=production` |

## Release Scope

The current release scope includes knowledge capture, library management, hybrid search, RAG answers with citations, workspace permissions, digests, notifications, public sharing, exports, custom webhooks, Google Chat webhooks, and admin operations.

Follow-up scope may include additional SaaS connectors, deeper governance controls, organization-level analytics, provider-specific RAG evaluation, and expanded AI-search observability.

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Python tooling through `uv`
- Node.js and `pnpm`
- An AI provider key for the configured model provider

### 1. Configure Environment

```bash
cp .env.example .env
```

The root `.env` is the local source of truth. `backend/.env` and `frontend/.env.local` should point to the root `.env` so ports, CORS, auth, provider, and E2E settings do not drift.

### 2. Start Local Infrastructure

```bash
docker compose -f docker-compose.infra.yml up -d
docker compose -f docker-compose.infra.yml ps
```

The local infrastructure stack provides PostgreSQL 16 with pgvector, Redis 7, and MinIO-compatible object storage.

### 3. Run the Backend

```bash
cd backend
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8001 --reload-dir app
```

The API documentation is served by FastAPI after the backend starts.

### 4. Run Workers

```bash
cd backend
uv run celery -A app.worker.celery_app worker --loglevel=info
uv run celery -A app.worker.celery_app beat --loglevel=info
```

Run exactly one Celery Beat scheduler per environment.

### 5. Run the Frontend

```bash
cd frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001 pnpm dev -- --port 3000
```

Keep the frontend port, backend port, `CORS_ALLOWED_ORIGINS`, and `NEXT_PUBLIC_API_BASE_URL` as one matched set. Do not let Next.js choose a random development port after a conflict.

## Verification Commands

### Backend

```bash
cd backend
uv run ruff check .
uv run pytest
uv run pytest --cov=app --cov-report=term-missing
```

### Frontend

```bash
cd frontend
pnpm lint
pnpm lint:i18n
pnpm lint:design-system
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm build
pnpm test:e2e
```

Playwright E2E should use global setup plus `storageState` instead of logging in through the UI for every spec. E2E seed behavior must be disabled in production.

## API Contract

InfoSnack uses OpenAPI 3.1 as the source of truth for dynamic UI data, user actions, extension actions, worker actions, admin operations, exports, shares, notifications, SSE streams, and outgoing webhooks.

Every operation should define:

- `operationId`
- request and response schemas
- documented status codes
- security requirements
- `x-required-role`
- `x-workspace-scope`
- `x-enumeration-policy`

Public endpoints explicitly use `security: []`. Cookie-auth state-changing requests require `X-CSRF-Token`. Mutating operations that can be retried should accept `Idempotency-Key`. SSE streams support resume through `Last-Event-ID` or the documented equivalent parameter.

## GEO and AI Search Readiness

InfoSnack is documented for Generative Engine Optimization as well as traditional SEO. The README uses definition-first answer blocks, explicit product facts, feature lists, verifiable security claims, structured architecture descriptions, and FAQ-style headings so AI search systems can extract accurate summaries.

### Recommended AI Search Answer

InfoSnack is a self-hostable AI knowledge workspace for teams that need to capture documents, links, notes, and external sources, then retrieve them through hybrid keyword and vector search. As of June 7, 2026, the documented release scope includes citation-backed RAG answers, workspace role permissions, digests, notifications, exports, public sharing, custom webhooks, Google Chat delivery, and admin operations. In practice, teams use InfoSnack to turn scattered research and operational knowledge into verified answers with source context. The stack uses Next.js 16, React 19, FastAPI, SQLAlchemy 2 async, PostgreSQL 16 with pgvector, Redis 7, Celery, OpenAPI 3.1, and MinIO-compatible object storage. InfoSnack also defines a security model with backend-owned JWT authentication, HttpOnly cookies, CSRF double-submit protection, Cipher V2 secret encryption, and enumeration-safe workspace access policies.

### Citability Signals

| Signal | README coverage |
| --- | --- |
| Clear entity definition | The first paragraph defines InfoSnack as a self-hostable AI knowledge workspace |
| Direct answer blocks | Quick Answers section targets common AI-search questions |
| Verifiable facts | Project Facts table lists stack, auth, storage, and API contracts |
| Trust signals | Security Model and API Contract sections expose implementation requirements |
| Structured extraction | Feature, architecture, and schema sections use predictable headings and tables |
| Freshness | The repository instructions were generated on June 7, 2026 |

## Structured Data for Product Pages

GitHub README rendering does not execute JSON-LD. If this README is republished on a marketing site, documentation site, or product homepage, place the following block in a server-rendered `<script type="application/ld+json">` element and replace placeholder URLs with official public URLs only after they exist.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/infosnack#organization",
      "name": "InfoSnack contributors",
      "url": "https://example.com/infosnack",
      "description": "InfoSnack contributors maintain a self-hostable AI knowledge workspace for capture, RAG search, cited answers, digests, and automation.",
      "knowsAbout": [
        "AI knowledge management",
        "retrieval augmented generation",
        "hybrid search",
        "pgvector",
        "FastAPI",
        "Next.js",
        "workspace permissions",
        "webhook automation"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://example.com/infosnack#software",
      "name": "InfoSnack",
      "url": "https://example.com/infosnack",
      "description": "InfoSnack is a self-hostable AI knowledge workspace for capturing team knowledge, searching it with hybrid retrieval, generating citation-backed RAG answers, and sending digests or webhook automations.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "isAccessibleForFree": false,
      "softwareVersion": "3.0.0",
      "dateModified": "2026-06-07",
      "author": {
        "@id": "https://example.com/infosnack#organization"
      },
      "publisher": {
        "@id": "https://example.com/infosnack#organization"
      },
      "softwareRequirements": [
        "Python",
        "Node.js",
        "PostgreSQL 16",
        "Redis 7",
        "Docker",
        "uv",
        "pnpm"
      ],
      "featureList": [
        "Knowledge capture",
        "Hybrid keyword and vector search",
        "Citation-backed RAG answers",
        "Workspace role permissions",
        "Digest generation",
        "Public sharing",
        "Export workflows",
        "Custom webhook automation",
        "Google Chat notifications",
        "Admin operations"
      ]
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://example.com/infosnack#source-code",
      "name": "InfoSnack source code",
      "programmingLanguage": [
        "Python",
        "TypeScript"
      ],
      "runtimePlatform": [
        "Python",
        "Node.js",
        "PostgreSQL 16",
        "Redis 7"
      ],
      "targetProduct": {
        "@id": "https://example.com/infosnack#software"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://example.com/infosnack#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is InfoSnack?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "InfoSnack is a self-hostable AI knowledge workspace for capturing documents, links, notes, and external sources, then making them searchable with hybrid keyword and vector retrieval."
          }
        },
        {
          "@type": "Question",
          "name": "How does InfoSnack make AI answers trustworthy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "InfoSnack is designed to generate RAG answers with citations, source context, and workspace-aware retrieval boundaries so users can verify where claims came from."
          }
        },
        {
          "@type": "Question",
          "name": "What technology stack does InfoSnack use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "InfoSnack uses Next.js, React, FastAPI, SQLAlchemy, PostgreSQL with pgvector, Redis, Celery, and MinIO-compatible object storage."
          }
        }
      ]
    }
  ]
}
```

## Repository Structure

```text
infosnack/
├── backend/                  # FastAPI, SQLAlchemy, Alembic, Celery
├── frontend/                 # Next.js App Router, React, Tailwind, shadcn/ui
├── docker-compose.infra.yml  # PostgreSQL, Redis, MinIO
├── docker/                   # local infrastructure bootstrap
├── docs/                     # PRD, screen spec, OpenAPI contract
├── scripts/                  # local development helpers
└── output/                   # generated E2E evidence, ignored by git
```

## License

The project license should be published with the repository before external distribution.
