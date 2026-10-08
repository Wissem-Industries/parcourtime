import type { H3Event } from 'h3'

// Plausible reads X-Plausible-IP before CF-Connecting-IP: without it, every event coming from
// this server through Cloudflare would carry the server address instead of the visitor's.
export function plausibleHeaders(event: H3Event, contentType: string): Record<string, string> {
  const ip =
    getRequestHeader(event, 'cf-connecting-ip') ?? getRequestIP(event, { xForwardedFor: true })
  const headers: Record<string, string> = {
    'content-type': contentType,
    'user-agent': getRequestHeader(event, 'user-agent') ?? 'unknown',
  }
  if (ip) {
    headers['x-plausible-ip'] = ip
    headers['x-forwarded-for'] = ip
  }
  return headers
}

export function plausibleApiHost(event: H3Event) {
  const { apiHost } = useRuntimeConfig(event).public.plausible as { apiHost?: string }
  return apiHost?.replace(/\/$/, '')
}
