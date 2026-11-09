# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Calendar export per campaign at `/agenda/<campagne>.ics`: subscription (`webcal://`) or download, one all-day event per key date, reminder the day before the main deadlines.
- Source link on each phase card.
- Data consistency tests (date order, source references) and iCalendar export tests.

### Changed

- Campaign 2026-2027 switched to the official Parcoursup 2027 calendar published in October 2026: every date is confirmed, with the bac results (6 July 2027) and the ranking of waiting-list wishes (4 to 7 June 2027) added. The "Période indicative" label is gone.
- Campaign 2025-2026: the information and review phases are marked official, their bounds come from the published calendar.
- The campaign start is no longer called "estimated" when its date is official; wording about estimates is shown only when a campaign still has some.
- The data update date in the footer is written in French.
- Sharing image regenerated from the official 2027 calendar.

### Fixed

- The `?campagne=` address now selects the campaign and follows the selector; the page announced shareable links without supporting them.
- Prerendered page: the clock starts from the build time carried by the payload and switches to the real time after mount, so phase status and countdown no longer depend on the build date and hydration matches.
- A single clock drives the page instead of two intervals.
- The countdown no longer announces every second to screen readers.
- Phase cards: the title and description were shown below the dates because of the DSFR card ordering.
- "Hors calendrier" status shown as information instead of error.

## [1.1.4] - 2026-10-22

### Changed

- Refresh the Nuxt, DSFR, test and build dependencies without changing the campaign data.

## [1.1.3] - 2026-10-08

### Fixed

- Analytics: events relayed to Plausible carry the visitor address in `X-Plausible-IP`; Cloudflare was replacing it with the server address.

## [1.1.2] - 2026-10-08

### Fixed

- Analytics: the first-party event path is `/_w` instead of `/_plausible`, which some content blockers list.

## [1.1.1] - 2026-10-02

### Changed

- Analytics events are sent through the site to the self-hosted Plausible instance (Plausible module 4).

## [1.1.0] - 2026-10-02

- Sharing image generated from the latest campaign (phase timeline, estimated dates flagged), replacing the Parcoursup banner. Open Graph and Twitter tags completed with absolute image URL, dimensions and alt text.
- `images:og` script; the sitemap announced in `robots.txt` is added.

## [1.0.0] - 2026-10-02

First release under the shared versioning of the wissem.pro projects.
- Parcoursup calendar: current phase, next deadline with countdown, campaign progress and every phase in order.
- Campaigns from several years, selectable and shareable by URL.
- Estimated dates of future campaigns marked as such, with sources for official dates.
- French interface built on the DSFR, usable on mobile and with a keyboard.
