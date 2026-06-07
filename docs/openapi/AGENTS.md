# OPENAPI CONTRACT NOTES

## OVERVIEW

`infosnack-api.yaml` is the API contract authority for dynamic UI data, user actions, extension actions, worker/admin actions, exports, shares, notifications, SSE, and outgoing webhooks.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Header/version | top of `infosnack-api.yaml` | Keep `openapi: 3.1.0`, `info.version: 3.0.0` |
| Endpoints | `paths:` | Every operation needs schema, security, role, scope, enumeration policy |
| Security | `components.securitySchemes` | Cookie, CSRF header, bearer token |
| Common params | `components.parameters` | Workspace, idempotency, cursor, SSE resume |
| Webhook payloads | `webhooks:` | Outgoing custom webhook schemas |
| Schemas | `components.schemas` | Shared request/response/state enums |

## CONTRACT RULES

- Keep OpenAPI Specification version and InfoSnack API version separate: `openapi` is spec version, `info.version` is product API contract version.
- Public endpoints must explicitly use `security: []`; authenticated endpoints rely on cookie or bearer security.
- Cookie-auth state-changing requests require `X-CSRF-Token`; bearer-auth extension/API clients use Authorization and client/scope checks instead.
- Every operation should carry `x-required-role`, `x-workspace-scope`, and `x-enumeration-policy`.
- Foreign workspace/resource access generally returns `404`; same-workspace role shortage returns `403` where the operation policy says so.
- Mutating operations that can be retried should expose `Idempotency-Key`.
- Cursor pagination is the default for large collections; do not introduce offset pagination for library/search-scale lists.
- SSE streams must support resume through `Last-Event-ID` or the documented equivalent parameter.
- Schema enums for state transitions must match PRD Appendix C and future DB/worker/UI values.

## WEBHOOK RULES

- `target_kind=custom` sends InfoSnack event payloads with HMAC signing.
- `target_kind=google_chat_incoming` sends Google Chat-compatible messages and does not use InfoSnack HMAC signing.
- Custom webhook create/rotation may return `signing_secret_once` exactly once.
- List/detail responses must never return raw signing secrets, raw credential values, or raw object keys.
- Signed webhook headers are part of the contract: `X-InfoSnack-Event-Id`, `X-InfoSnack-Timestamp`, `X-InfoSnack-Signature`, and `X-InfoSnack-Retry-Count`.

## ANTI-PATTERNS

- Do not add an endpoint without operationId, request/response schemas, status codes, security, role, workspace scope, and enumeration policy.
- Do not encode frontend-only state as an API enum when it can be derived from fields like `expires_at`, `revoked_at`, or `heartbeat_at`.
- Do not expose raw extraction, embeddings, provider raw responses, auth headers, cookies, or secrets in schemas unless the field is explicitly redacted.
- Do not add webhook behavior only under `paths:`; outgoing payload contracts belong in the OpenAPI 3.1 `webhooks` section too.
- Do not leave PRD or screen spec behind when API semantics change.
