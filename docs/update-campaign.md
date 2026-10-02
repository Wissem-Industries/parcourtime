# Updating a campaign

Parcoursup dates change every year. They are kept in a single file, `app/data/parcoursup/campaigns.json`; the interface reads it and needs no change.

## Rules

- Use `parcoursup.gouv.fr`, the ministry or another official document first.
- In a future campaign, mark every estimated date with `certainty: 'estimated'`. When no estimate is possible, use `certainty: 'to_confirm'` and leave `start`, `end` and `date` out.
- Write dates in ISO format with the Europe/Paris offset, for example `2026-03-12T23:59:59+01:00`.
- For official dates, list the sources in `sources` and reference their ids in `sourceIds`. Estimates keep both lists empty.
- Set `lastUpdated` to the day of the check.
- Do not edit `campaigns.ts` to add a campaign: it only types the data.

## Adding a campaign

1. Copy an existing campaign in `campaigns`.
2. Change `id`, `label`, `lastUpdated` and the sources.
3. Fill in the phases with official dates or clearly marked estimates; leave unpublished phases as `to_confirm`.
4. Run `bun run check`.
