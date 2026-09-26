import type {
  Campaign,
  Deadline,
  Milestone,
  ParcoursupPhase,
  PhaseStatus,
  Source,
} from '~/types/parcoursup'

const dayFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'long',
  timeZone: 'Europe/Paris',
})

const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Paris',
})
const PRE_CAMPAIGN_WINDOW_MS = 30 * 24 * 60 * 60 * 1000

export const parseDate = (value?: string) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export const sortPhases = (phases: ParcoursupPhase[]) =>
  [...phases].sort((a, b) => a.order - b.order)

export const getPhaseStatus = (phase: ParcoursupPhase, now: Date): PhaseStatus => {
  const start = parseDate(phase.start)
  const end = parseDate(phase.end)

  if (phase.certainty === 'to_confirm' || !start || !end) {
    return 'date_unconfirmed'
  }

  if (now < start) return 'upcoming'
  if (now > end) return 'finished'
  return 'active'
}

export const getCurrentPhase = (campaign: Campaign, now: Date) =>
  sortPhases(campaign.phases).find((phase) => getPhaseStatus(phase, now) === 'active') ?? null

export const hasUnconfirmedDates = (campaign: Campaign) =>
  campaign.phases.some(
    (phase) => phase.certainty !== 'official' && phase.certainty !== 'past_official',
  )

const toDeadline = (phase: ParcoursupPhase, milestone: Milestone): Deadline | null => {
  const date = parseDate(milestone.date)
  if (!date || milestone.certainty === 'to_confirm') return null

  return {
    id: milestone.id,
    title: milestone.title,
    date,
    displayDate: milestone.displayDate ?? formatDateTime(date),
    phaseId: phase.id,
    phaseTitle: phase.title,
    sourceIds: milestone.sourceIds,
    importance: milestone.importance ?? 'secondary',
  }
}

export const getUpcomingDeadlines = (campaign: Campaign, now: Date) =>
  sortPhases(campaign.phases)
    .flatMap((phase) =>
      (phase.milestones ?? [])
        .map((milestone) => toDeadline(phase, milestone))
        .filter((deadline): deadline is Deadline => Boolean(deadline)),
    )
    .filter((deadline) => deadline.date > now)
    .sort((a, b) => {
      const byDate = a.date.getTime() - b.date.getTime()
      if (byDate !== 0) return byDate
      if (a.importance === b.importance) return 0
      return a.importance === 'primary' ? -1 : 1
    })

export const getNextDeadline = (campaign: Campaign, now: Date) => {
  const firstPhase = sortPhases(campaign.phases)
    .map((phase) => ({ phase, start: parseDate(phase.start) }))
    .filter((entry): entry is { phase: ParcoursupPhase; start: Date } => Boolean(entry.start))
    .sort((a, b) => a.start.getTime() - b.start.getTime())[0]

  if (firstPhase && now < firstPhase.start) {
    return {
      id: `${firstPhase.phase.id}-start`,
      title: 'Début estimé de la campagne',
      date: firstPhase.start,
      displayDate: formatDateTime(firstPhase.start),
      phaseId: firstPhase.phase.id,
      phaseTitle: firstPhase.phase.title,
      sourceIds: firstPhase.phase.sourceIds,
      importance: 'primary' as const,
    }
  }

  return getUpcomingDeadlines(campaign, now)[0] ?? null
}

export const getCampaignBounds = (campaign: Campaign) => {
  const ranges = campaign.phases
    .map((phase) => ({
      start: parseDate(phase.start),
      end: parseDate(phase.end),
    }))
    .filter(
      (range): range is { start: Date; end: Date } => Boolean(range.start) && Boolean(range.end),
    )

  if (!ranges.length) return null

  const start = new Date(Math.min(...ranges.map((range) => range.start.getTime())))
  const end = new Date(Math.max(...ranges.map((range) => range.end.getTime())))

  return { start, end }
}

export const getCampaignProgress = (campaign: Campaign, now: Date) => {
  const bounds = getCampaignBounds(campaign)
  if (!bounds) return null

  const progressStart = new Date(bounds.start.getTime() - PRE_CAMPAIGN_WINDOW_MS)
  const total = bounds.end.getTime() - progressStart.getTime()
  if (total <= 0) return null

  const elapsed = now.getTime() - progressStart.getTime()
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}

export const formatDate = (date: Date) => dayFormatter.format(date)

export const formatDateTime = (date: Date) => dateTimeFormatter.format(date)

export const formatPhaseRange = (phase: ParcoursupPhase) => {
  if (phase.displayDate) return phase.displayDate

  const start = parseDate(phase.start)
  const end = parseDate(phase.end)

  if (!start || !end) return 'Date à confirmer'
  return `${formatDate(start)} au ${formatDate(end)}`
}

export const getSourcesById = (sources: Source[]) =>
  new Map(sources.map((source) => [source.id, source]))

export const getSourceList = (campaign: Campaign, sourceIds: string[]) => {
  const sourcesById = getSourcesById(campaign.sources)
  return sourceIds
    .map((sourceId) => sourcesById.get(sourceId))
    .filter((source): source is Source => Boolean(source))
}
