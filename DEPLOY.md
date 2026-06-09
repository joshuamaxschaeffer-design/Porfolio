# Deploying

The live site (**schaeffer.design** + **schaeffer.studio**, both aliased to the
same deployment) is the Vercel project **`porfolio`**.

- projectId: `prj_WWm9Ft1Mls1y7kbBFoAIZFL8xik8`
- team/scope: `joshua-schaeffer-s-projects` (`team_m6a9hv2mxIPnj3Sxp4babE5W`)
- env vars (DATABASE_URI, PAYLOAD_SECRET, *_SERVER_URL) live ON this project.

## Preferred: git push (auto-deploy)

```bash
git add -A && git commit -m "…" && git push origin main
```

Vercel auto-builds every push to `main` and promotes it to production. This is
the safest path — it always targets `porfolio` via the GitHub integration.

## Manual: guarded CLI deploy

```bash
pnpm deploy            # = bash scripts/deploy.sh
```

`scripts/deploy.sh` **refuses to deploy** unless `.vercel/project.json` points
at `porfolio`, then runs `vercel --prod --yes --scope joshua-schaeffer-s-projects`.
Do not call `vercel --prod` directly — use the script so the link is verified.

## ⚠️ The trap this prevents

There used to be a second, empty project `schaeffer-portfolio` (no DB env). A
stale `.vercel` link sent CLI deploys there; they "succeeded" into a broken,
DB-less build that never touched the live domains (duplicate hero, blank
images). That project has been **deleted**. If you ever see a deploy that builds
but the live site doesn't change — check `.vercel/project.json` first.

## Verify after deploy

```bash
vercel ls porfolio --scope joshua-schaeffer-s-projects | head -3   # newest = ● Ready
curl -s -o /dev/null -w "%{http_code}\n" https://schaeffer.design  # 200
```

## Build pinning

`next` and `eslint-config-next` are pinned to **15.4.11** (not `^15`). Next
15.5.x violates `@payloadcms/next`'s peer range and breaks `npm install`.
`pnpm-lock.yaml` is committed; keep it in sync when changing deps. Deploys use
pnpm (the repo declares `packageManager: pnpm@…`).
