import { getCampaignById } from '../../../app/data/parcoursup/campaigns'
import { buildCampaignIcs } from '../../../app/utils/ics'

export default defineEventHandler((event) => {
  const file = getRouterParam(event, 'file') ?? ''
  const campaign = file.endsWith('.ics') ? getCampaignById(file.slice(0, -4)) : undefined
  if (!campaign) throw createError({ statusCode: 404, statusMessage: 'Campagne inconnue' })

  setResponseHeaders(event, {
    'content-type': 'text/calendar; charset=utf-8',
    'content-disposition': `inline; filename="parcoursup-${campaign.id}.ics"`,
    'cache-control': 'public, max-age=3600',
  })
  return buildCampaignIcs(campaign)
})
