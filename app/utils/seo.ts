import type { Campaign } from '~/types/parcoursup'

export const SITE_URL = 'https://parcourtime.wissem.pro/'
export const SITE_NAME = 'ParcourTime'

/** Parcoursup names a campaign after the year it ends: 2026-2027 is « Parcoursup 2027 ». */
export const campaignYear = (campaign: Campaign) => campaign.id.split('-')[1] ?? campaign.id

export const pageTitle = (campaign: Campaign) =>
  `Calendrier Parcoursup ${campaignYear(campaign)} : dates et compte à rebours | ${SITE_NAME}`

export const pageDescription = (campaign: Campaign) =>
  `Les phases et échéances de Parcoursup ${campaignYear(campaign)}, la prochaine date clé et un compte à rebours, à ajouter à votre agenda. Site indépendant de Parcoursup.`

export const lastModified = (campaigns: Campaign[]) =>
  campaigns
    .map((campaign) => campaign.lastUpdated)
    .sort()
    .at(-1)

export const buildSitemap = (campaigns: Campaign[]) => {
  const lastmod = lastModified(campaigns)
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>
</urlset>
`
}

export const buildStructuredData = (campaign: Campaign, campaigns: Campaign[]) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: 'fr-FR',
      publisher: { '@id': 'https://www.wissem.pro/#person' },
    },
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}#app`,
      url: SITE_URL,
      name: SITE_NAME,
      description: pageDescription(campaign),
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      inLanguage: 'fr-FR',
      isAccessibleForFree: true,
      dateModified: lastModified(campaigns),
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      author: { '@id': 'https://www.wissem.pro/#person' },
      isPartOf: { '@id': `${SITE_URL}#website` },
    },
    {
      '@type': 'Person',
      '@id': 'https://www.wissem.pro/#person',
      name: 'Wissem Badraoui',
      url: 'https://www.wissem.pro/',
    },
  ],
})
