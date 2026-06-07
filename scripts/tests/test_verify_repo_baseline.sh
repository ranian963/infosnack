#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

if [[ ! -x scripts/verify-repo-baseline.sh ]]; then
  echo "FAIL missing executable scripts/verify-repo-baseline.sh"
  exit 1
fi

bash scripts/verify-repo-baseline.sh

echo "PASS test_verify_repo_baseline"
