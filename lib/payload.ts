import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Returns a singleton Payload instance. Use this in server components
 * and route handlers to query the CMS directly without HTTP overhead.
 */
export const getPayloadClient = async () => {
  return getPayload({ config })
}
