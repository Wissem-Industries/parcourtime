import { describe, expect, it } from 'vitest'
import { campaigns } from '../../app/data/parcoursup/campaigns'
import {
  buildSitemap,
  buildStructuredData,
  campaignYear,
  lastModified,
  pageDescription,
  pageTitle,
} from '../../app/utils/seo'

const campaign2027 = campaigns.find((campaign) => campaign.id === '2026-2027')!

describe('seo', () => {
  it('names the campaign after the year it ends', () => {
    expect(campaignYear(campaign2027)).toBe('2027')
    expect(pageTitle(campaign2027)).toContain('Calendrier Parcoursup 2027')
  })

  it('keeps the description within what search results show', () => {
    expect(pageDescription(campaign2027).length).toBeLessThanOrEqual(160)
  })

  it('dates the sitemap with the latest calendar update', () => {
    const sitemap = buildSitemap(campaigns)
    expect(sitemap).toContain('<loc>https://parcourtime.wissem.pro/</loc>')
    expect(sitemap).toContain(`<lastmod>${lastModified(campaigns)}</lastmod>`)
  })

  it('describes the site as a free web application', () => {
    const data = buildStructuredData(campaign2027, campaigns)
    const app = data['@graph'].find((node) => node['@type'] === 'WebApplication')
    expect(app).toMatchObject({ isAccessibleForFree: true, operatingSystem: 'Web' })
  })
})
