import { describe, expect, it } from 'vitest'
import { campaigns, defaultCampaignId } from '../../app/data/parcoursup/campaigns'
import {
  getCampaignProgress,
  getCurrentPhase,
  getNextDeadline,
  getPhaseStatus,
  hasUnconfirmedDates,
  parseDate,
  sortPhases,
} from '../../app/utils/calendar'
import { buildCampaignIcs } from '../../app/utils/ics'

const campaign2026 = campaigns.find((campaign) => campaign.id === '2025-2026')!
const campaign2027 = campaigns.find((campaign) => campaign.id === '2026-2027')!

describe('calendar utilities', () => {
  it('opens the most recent campaign by default', () => {
    expect(defaultCampaignId).toBe([...campaigns].sort((a, b) => b.id.localeCompare(a.id))[0]?.id)
  })
  it('sorts phases chronologically by order', () => {
    const phases = sortPhases([...campaign2026.phases].reverse())

    expect(phases[0]?.id).toBe('information')
    expect(phases.at(-1)?.id).toBe('phase-complementaire')
  })

  it('detects the active phase from an injected date', () => {
    const now = new Date('2026-05-22T12:00:00+02:00')
    const currentPhase = getCurrentPhase(campaign2026, now)

    expect(currentPhase?.id).toBe('examen')
  })

  it('returns the next official deadline', () => {
    const now = new Date('2026-05-22T12:00:00+02:00')
    const deadline = getNextDeadline(campaign2026, now)

    expect(deadline?.id).toBe('debut-admission')
    expect(deadline?.date.toISOString()).toBe('2026-06-01T22:00:00.000Z')
  })

  it('uses the official 2027 calendar', () => {
    const now = new Date('2026-09-26T12:00:00+02:00')
    const phase = campaign2027.phases[0]!

    expect(hasUnconfirmedDates(campaign2027)).toBe(false)
    expect(getPhaseStatus(phase, now)).toBe('upcoming')
    expect(getCurrentPhase(campaign2027, now)).toBeNull()
    expect(getNextDeadline(campaign2027, now)).toMatchObject({
      id: 'information-start',
      title: 'Début de la campagne',
    })
    expect(getCampaignProgress(campaign2027, now)).toBeGreaterThan(0)
  })

  it('points to the closing of the wishes in February 2027', () => {
    const deadline = getNextDeadline(campaign2027, new Date('2027-02-01T12:00:00+01:00'))

    expect(deadline?.id).toBe('dernier-jour-voeux')
    expect(deadline?.date.toISOString()).toBe('2027-03-11T22:59:59.000Z')
  })

  it('keeps every campaign consistent', () => {
    for (const campaign of campaigns) {
      const sourceIds = new Set(campaign.sources.map((source) => source.id))
      for (const phase of campaign.phases) {
        const start = parseDate(phase.start)
        const end = parseDate(phase.end)
        if (phase.certainty !== 'to_confirm') expect(start && end && start < end).toBe(true)
        for (const id of phase.sourceIds) expect(sourceIds.has(id)).toBe(true)
        for (const milestone of phase.milestones ?? []) {
          for (const id of milestone.sourceIds) expect(sourceIds.has(id)).toBe(true)
          if (milestone.certainty === 'official')
            expect(milestone.sourceIds.length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('handles dates before and after a phase', () => {
    const phase = campaign2026.phases.find((item) => item.id === 'voeux')!

    expect(getPhaseStatus(phase, new Date('2026-01-01T12:00:00+01:00'))).toBe('upcoming')
    expect(getPhaseStatus(phase, new Date('2026-02-01T12:00:00+01:00'))).toBe('active')
    expect(getPhaseStatus(phase, new Date('2026-03-13T12:00:00+01:00'))).toBe('finished')
  })
})

describe('agenda export', () => {
  const ics = buildCampaignIcs(campaign2027)
  const lines = ics.split('\r\n')

  it('produces a valid iCalendar envelope', () => {
    expect(lines[0]).toBe('BEGIN:VCALENDAR')
    expect(lines.at(-2)).toBe('END:VCALENDAR')
    expect(lines.filter((line) => line === 'BEGIN:VEVENT')).toHaveLength(
      campaign2027.phases.flatMap((phase) => phase.milestones ?? []).length,
    )
  })

  it('uses the Paris calendar day for late-evening deadlines', () => {
    const start = ics.indexOf('UID:2026-2027-dernier-jour-voeux@')
    const event = ics.slice(start, ics.indexOf('END:VEVENT', start))

    expect(event).toContain('DTSTART;VALUE=DATE:20270311')
    expect(event).toContain('DTEND;VALUE=DATE:20270312')
  })

  it('folds lines at 75 octets', () => {
    const encoder = new TextEncoder()
    for (const line of lines) expect(encoder.encode(line).length).toBeLessThanOrEqual(75)
  })
})
