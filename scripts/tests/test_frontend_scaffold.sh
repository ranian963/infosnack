#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

fail() {
  echo "FAIL $*"
  exit 1
}

require_file() {
  local path="$1"
  [[ -f "$path" ]] || fail "missing required file: $path"
}

routes=(
  "/"
  "/login"
  "/register/invite"
  "/capture"
  "/library"
  "/library/[contentId]"
  "/sources"
  "/sources/new"
  "/sources/[sourceId]"
  "/search"
  "/chat"
  "/digests"
  "/digests/[digestId]"
  "/digests/[digestId]/curation"
  "/shares/[token]"
  "/settings/profile"
  "/settings/workspace"
  "/settings/credentials"
  "/settings/notifications"
  "/settings/export"
  "/settings/webhooks"
  "/admin"
)

require_file frontend/package.json
require_file frontend/src/lib/routes.ts
require_file frontend/src/lib/api/generated.ts
require_file frontend/src/lib/api/client.ts
require_file frontend/messages/ko.json
require_file frontend/messages/en.json
require_file frontend/src/app/layout.tsx

for route in "${routes[@]}"; do
  rg -F "\"$route\"" frontend/src/lib/routes.ts >/dev/null \
    || fail "route missing from registry: $route"
done

rg -F 'from "./generated"' frontend/src/lib/api/client.ts >/dev/null \
  || fail "canonical API client must import generated OpenAPI types"

pnpm --dir frontend lint:i18n
pnpm --dir frontend lint:design-system
pnpm --dir frontend typecheck

echo "PASS frontend scaffold"
