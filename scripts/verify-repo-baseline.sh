#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

fail() {
  echo "FAIL $*"
  exit 1
}

require_file() {
  local path="$1"
  [[ -f "$path" ]] || fail "missing required file: $path"
}

require_ignored() {
  local path="$1"
  git check-ignore -q "$path" || fail "expected ignored artifact path: $path"
}

require_not_ignored() {
  local path="$1"
  if git check-ignore -q "$path"; then
    fail "versioned guidance path is ignored: $path"
  fi
}

require_file AGENTS.md
require_file docs/AGENTS.md
require_file docs/openapi/AGENTS.md
require_file docs/InfoSnack_PRD_v3.0.md
require_file docs/InfoSnack_화면설계.md
require_file docs/openapi/infosnack-api.yaml
require_file .env.example
require_file .gitignore
require_file docker-compose.infra.yml
require_file docker/postgres/init/01-extensions.sql
require_file .omo/plans/infosnack-full-implementation.md

rg -q '^openapi: 3\.1\.0$' docs/openapi/infosnack-api.yaml \
  || fail "OpenAPI contract must remain OpenAPI 3.1.0"
rg -q '^[[:space:]]*version: 3\.0\.0$' docs/openapi/infosnack-api.yaml \
  || fail "InfoSnack API contract version must remain 3.0.0"

require_not_ignored AGENTS.md
require_not_ignored docs/AGENTS.md
require_not_ignored docs/openapi/AGENTS.md

require_ignored .env
require_ignored .DS_Store
require_ignored .InfoSnack_화면설계.md.swp
require_ignored output/e2e-captures/20260607-baseline/screenshot.png
require_ignored frontend/e2e/.auth/user.json

if rg -n '(^|[^/])openapi/infosnack-api\.yaml|/Users/chester/dev/infos/openapi/infosnack-api\.yaml' \
  AGENTS.md docs/AGENTS.md docs/InfoSnack_PRD_v3.0.md docs/InfoSnack_화면설계.md >/tmp/infosnack-baseline-paths.txt; then
  cat /tmp/infosnack-baseline-paths.txt
  rm -f /tmp/infosnack-baseline-paths.txt
  fail "stale OpenAPI path reference"
fi
rm -f /tmp/infosnack-baseline-paths.txt

staged_files="$(git diff --cached --name-only)"
if [[ -n "${INFOSNACK_BASELINE_STAGED_FILES:-}" ]]; then
  staged_files="${staged_files}"$'\n'"${INFOSNACK_BASELINE_STAGED_FILES}"
fi

if printf '%s\n' "$staged_files" | rg -q '(^|/)\.env($|[.])|(^|/)\.DS_Store$|\.sw[po]$|^output/|(^|/)e2e/\.auth/'; then
  fail "secret artifact must not be staged"
fi

echo "PASS baseline"
