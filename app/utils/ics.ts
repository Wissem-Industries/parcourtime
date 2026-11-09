import type { Campaign } from '~/types/parcoursup'
import { getSourceList, parseDate, sortPhases, toParisDay } from './calendar'

const SITE = 'parcourtime.wissem.pro'
const MAX_LINE_OCTETS = 75

const escapeText = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

/** Folds a content line at 75 octets without splitting a UTF-8 character (RFC 5545, 3.1). */
const fold = (line: string) => {
  const encoder = new TextEncoder()
  const parts: string[] = []
  let current = ''
  let size = 0
  for (const char of line) {
    const charSize = encoder.encode(char).length
    const limit = parts.length ? MAX_LINE_OCTETS - 1 : MAX_LINE_OCTETS
    if (size + charSize > limit) {
      parts.push(current)
      current = ''
      size = 0
    }
    current += char
    size += charSize
  }
  parts.push(current)
  return parts.join('\r\n ')
}

const compactDay = (day: string) => day.replaceAll('-', '')

const nextDay = (day: string) => {
  const date = new Date(`${day}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0, 10)
}

export const icsPath = (campaignId: string) => `/agenda/${campaignId}.ics`

/** Milestones of a campaign as all-day iCalendar events. Estimated dates are labelled as such. */
export const buildCampaignIcs = (campaign: Campaign) => {
  const stamp = `${compactDay(campaign.lastUpdated)}T000000Z`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//Wissem's Industries//ParcourTime//FR`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(`Parcoursup ${campaign.id}`)}`,
    'X-WR-TIMEZONE:Europe/Paris',
    'REFRESH-INTERVAL;VALUE=DURATION:P1D',
    'X-PUBLISHED-TTL:P1D',
  ]

  for (const phase of sortPhases(campaign.phases)) {
    for (const milestone of phase.milestones ?? []) {
      const date = parseDate(milestone.date)
      if (!date || milestone.certainty === 'to_confirm') continue

      const day = toParisDay(date)
      const estimated = milestone.certainty === 'estimated'
      const source = getSourceList(campaign, milestone.sourceIds)[0]
      const description = [
        milestone.displayDate,
        milestone.shortDescription,
        `Phase : ${phase.title}`,
        estimated ? 'Date estimée, à vérifier sur parcoursup.gouv.fr.' : null,
        source ? `Source : ${source.url}` : null,
      ]
        .filter(Boolean)
        .join('\n')

      lines.push(
        'BEGIN:VEVENT',
        `UID:${campaign.id}-${milestone.id}@${SITE}`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${compactDay(day)}`,
        `DTEND;VALUE=DATE:${compactDay(nextDay(day))}`,
        `SUMMARY:${escapeText(`Parcoursup : ${milestone.title}${estimated ? ' (estimation)' : ''}`)}`,
        `DESCRIPTION:${escapeText(description)}`,
        `URL:https://${SITE}/?campagne=${campaign.id}`,
        'TRANSP:TRANSPARENT',
      )
      if (milestone.importance === 'primary') {
        lines.push(
          'BEGIN:VALARM',
          'ACTION:DISPLAY',
          `DESCRIPTION:${escapeText(milestone.title)}`,
          'TRIGGER:-PT15H',
          'END:VALARM',
        )
      }
      lines.push('END:VEVENT')
    }
  }

  lines.push('END:VCALENDAR')
  return `${lines.map(fold).join('\r\n')}\r\n`
}
