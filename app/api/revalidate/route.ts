import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * On-demand revalidation. Called by Payload's afterChange/afterDelete hooks
 * (see hooks/revalidate.ts) whenever a Page, CaseStudy, or Global changes.
 *
 * This is what makes ISR feel live — pages are pre-built at deploy and
 * regenerated within seconds of any CMS edit, without rebuilding the site.
 *
 * Protect with PAYLOAD_SECRET so random visitors can't trigger revalidation.
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  if (secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { paths, tags } = body as { paths?: string[]; tags?: string[] }

    if (Array.isArray(paths)) {
      for (const p of paths) {
        revalidatePath(p)
      }
    }
    if (Array.isArray(tags)) {
      for (const t of tags) {
        revalidateTag(t)
      }
    }

    return NextResponse.json({ revalidated: true, paths, tags })
  } catch (err) {
    return NextResponse.json({ message: 'Error', error: String(err) }, { status: 500 })
  }
}
