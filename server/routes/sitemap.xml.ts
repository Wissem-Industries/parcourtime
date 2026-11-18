import { campaigns } from '../../app/data/parcoursup/campaigns'
import { buildSitemap } from '../../app/utils/seo'

export default defineEventHandler((event) => {
  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return buildSitemap(campaigns)
})
