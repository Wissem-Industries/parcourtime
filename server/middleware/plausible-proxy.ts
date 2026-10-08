// Relays the browser events sent to /_w/api/event with the visitor address (see utils/plausible.ts).
export default defineEventHandler(async (event) => {
  if (event.method !== 'POST' || getRequestURL(event).pathname !== '/_w/api/event') return
  const apiHost = plausibleApiHost(event)
  if (!apiHost) throw createError({ statusCode: 503, statusMessage: 'Analytics not configured' })
  try {
    const response = await fetch(`${apiHost}/api/event`, {
      method: 'POST',
      headers: plausibleHeaders(event, getRequestHeader(event, 'content-type') ?? 'text/plain'),
      body: (await readRawBody(event)) ?? '',
      signal: AbortSignal.timeout(10_000),
    })
    setResponseStatus(event, response.status)
    return await response.text()
  } catch (error) {
    console.warn('Analytics event not relayed', error)
    throw createError({ statusCode: 502, statusMessage: 'Analytics unavailable' })
  }
})
