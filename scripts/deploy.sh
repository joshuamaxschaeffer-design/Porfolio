#!/usr/bin/env bash
# Guarded production deploy for the Schaeffer portfolio.
#
# WHY THIS EXISTS: There used to be TWO Vercel projects under the same team —
# the live one (`porfolio`) and a dead empty one (`schaeffer-portfolio`).
# A stale .vercel link sent `vercel --prod` to the dead project, which had no
# DATABASE_URI, so every deploy "succeeded" into a broken build that never
# touched the live domains. The dead project is now deleted, but this script
# is the belt-and-suspenders: it refuses to deploy unless the link points at
# the known-good project.
set -euo pipefail

EXPECTED_PROJECT_ID="prj_WWm9Ft1Mls1y7kbBFoAIZFL8xik8"   # porfolio (LIVE)
EXPECTED_NAME="porfolio"
SCOPE="joshua-schaeffer-s-projects"
LINK=".vercel/project.json"

cd "$(dirname "$0")/.."

if [[ ! -f "$LINK" ]]; then
  echo "✗ $LINK missing — run from the repo root, link is required." >&2
  exit 1
fi

ACTUAL_ID=$(node -e "process.stdout.write(require('./.vercel/project.json').projectId||'')")
if [[ "$ACTUAL_ID" != "$EXPECTED_PROJECT_ID" ]]; then
  echo "✗ ABORT: .vercel/project.json points to projectId '$ACTUAL_ID'," >&2
  echo "  but the LIVE project ($EXPECTED_NAME) is '$EXPECTED_PROJECT_ID'." >&2
  echo "  Re-link before deploying:" >&2
  echo "    printf '%s' '{\"projectId\":\"$EXPECTED_PROJECT_ID\",\"orgId\":\"team_m6a9hv2mxIPnj3Sxp4babE5W\",\"projectName\":\"$EXPECTED_NAME\"}' > $LINK" >&2
  exit 1
fi

echo "✓ Link verified → $EXPECTED_NAME ($EXPECTED_PROJECT_ID)"
echo "→ Deploying to production…"
exec vercel --prod --yes --scope "$SCOPE" "$@"
