/**
 * One-off: drop the v1 Capabilities tables (the `*_categories*` tables from the
 * first grid version of this page) so the dev-push no longer asks whether the
 * new `*_sections*` tables are renames of them. Purely removes orphaned tables
 * that the current schema no longer references. Safe: these held only FPO data.
 *
 * Run with: pnpm payload run scripts/drop-stale-capabilities-tables.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  const db: any = payload.db

  // Find any leftover capabilities tables that reference the old `categories`
  // naming (across both pages_ and case_studies_ prefixes).
  const { rows } = await db.pool.query(
    `select tablename from pg_tables
     where schemaname = 'public'
       and tablename like '%capabilities_page%categories%'
     order by tablename`,
  )
  const stale: string[] = rows.map((r: any) => r.tablename)

  if (!stale.length) {
    console.log('No stale capabilities `_categories` tables found. Nothing to drop.')
    process.exit(0)
  }

  console.log('Dropping stale tables:')
  for (const t of stale) console.log('  -', t)

  // CASCADE handles the child/junction FKs between them.
  for (const t of stale) {
    await db.pool.query(`drop table if exists "${t}" cascade`)
  }

  console.log('Done.')
  process.exit(0)
}

await run().catch((err) => {
  console.error('Drop failed:', err)
  process.exit(1)
})
