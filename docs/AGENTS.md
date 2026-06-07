# DOCS KNOWLEDGE BASE

## OVERVIEW

`docs/` is the active product contract area. Treat PRD, screen design, and OpenAPI as a synchronized set, not independent notes.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Current PRD | `InfoSnack_PRD_v3.0.md` | Product, architecture, security, release gates |
| Screen/UI contract | `InfoSnack_화면설계.md` | Route map, screen states, UI actions |
| API contract | `openapi/infosnack-api.yaml` | OpenAPI 3.1 schema and endpoint authority |
| Auto collection idea doc | `InfoSnack_자동수집_기획서_v1.0.md` | Planning reference; reconcile with PRD before treating as current |
| Historical PRDs | `backup/` | Archive only |

## SYNC RULES

- PRD changes that alter features, screen actions, states, roles, endpoints, schemas, errors, streaming, webhooks, deployment gates, or test gates must be reflected in the screen spec and OpenAPI contract.
- Screen spec changes that alter product meaning must be reflected in the PRD and OpenAPI.
- OpenAPI changes that alter product meaning must be reflected in the PRD and screen spec.
- Completion is invalid if only one of PRD, screen spec, or OpenAPI moves while the others need the same semantic update.
- OpenAPI path in this checkout is `docs/openapi/infosnack-api.yaml`; older text may refer to future `openapi/infosnack-api.yaml`.

## CONVENTIONS

- Korean is the source language for product copy and UX wording.
- Use explicit release-scope terms: `전체 출시 범위`, `현재 출시 범위`, `후속 범위`, `출시 단계`.
- Keep operation IDs, functional requirement IDs, E2E scenario names, and screen actions aligned when adding product behavior.
- New webhook, SSE, auth, permission, pagination, export, or admin behavior needs API contract wording, UI state wording, and test evidence wording.
- When referencing Korean filenames from scripts, prefer discovered paths from `rg --files` because filenames are visually Korean but may be Unicode-decomposed on disk.

## ANTI-PATTERNS

- Do not treat `docs/backup/` as current requirements.
- Do not add API-only behavior that cannot be reached from a screen or supported workflow.
- Do not add UI-only actions without a matching API operation or explicit explanation.
- Do not leave v1/v2/NextAuth/bearer-only assumptions in v3.0 contract text unless explicitly marked historical.
- Do not write screenshots or E2E artifacts into `docs/`; use `output/e2e-captures/<YYYYMMDD>-<feature>/`.

## NOTES

- The PRD expects future normalized docs such as `docs/PRD.md`, `docs/screens.md`, `docs/ARCHITECTURE.md`, and `docs/testing.md`; they are not present yet.
- Public share, admin users, custom/Google Chat webhook behavior, and one-time signing secrets are high-drift areas across the three active docs.
