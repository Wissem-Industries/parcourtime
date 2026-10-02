/**
 * Generates the 1200×630 sharing image of the default campaign from
 * app/data/parcoursup/campaigns.json. Output: public/og.png.
 *
 * Usage: bun scripts/og.ts
 */
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'
import rawCampaigns from '../app/data/parcoursup/campaigns.json'
import type { Campaign } from '../app/types/parcoursup'

const WIDTH = 1200
const HEIGHT = 630
const OUTPUT = fileURLToPath(new URL('../public/og.png', import.meta.url))
const FONTS = new URL('../public/fonts/', import.meta.url)

const SHORT_LABELS: Record<number, string> = {
  1: 'Découvrir',
  2: 'Vœux',
  3: 'Dossier',
  4: 'Examen',
  5: 'Réponses',
  6: 'Complémentaire',
}

const campaigns = rawCampaigns as Campaign[]
const campaign = [...campaigns].sort((a, b) => b.id.localeCompare(a.id))[0] as Campaign
const estimated = campaign.phases.some((phase) => phase.certainty !== 'official')

function font(file: string) {
  return pathToFileURL(fileURLToPath(new URL(file, FONTS))).href
}

function template() {
  const cells = [...campaign.phases]
    .sort((a, b) => a.order - b.order)
    .map(
      (phase) => `<li>
        <span class="num">${phase.order}</span>
        <span class="name">${SHORT_LABELS[phase.order] ?? phase.title}</span>
      </li>`,
    )
    .join('')
  return `<!doctype html>
<html lang="fr">
<meta charset="utf-8">
<title>ParcourTime</title>
<style>
  @font-face { font-family: Marianne; src: url("${font('Marianne-Regular.woff2')}"); font-weight: 400; }
  @font-face { font-family: Marianne; src: url("${font('Marianne-Medium.woff2')}"); font-weight: 500; }
  @font-face { font-family: Marianne; src: url("${font('Marianne-Bold.woff2')}"); font-weight: 700; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    position: relative;
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
    background: #fff;
    color: #161616;
    font-family: Marianne, sans-serif;
  }
  .bar { position: absolute; inset: 0 0 auto 0; height: 14px; background: #000091; }
  .page { position: absolute; inset: 14px 0 0 0; display: flex; flex-direction: column; justify-content: space-between; padding: 48px 80px 52px; }
  .head { display: flex; align-items: center; justify-content: space-between; }
  .brand { font-size: 34px; font-weight: 700; color: #000091; }
  .url { font-size: 24px; color: #666; }
  h1 { font-size: 78px; font-weight: 700; line-height: 1.02; letter-spacing: -0.02em; }
  h1 span { color: #000091; }
  .lead { margin-top: 18px; font-size: 28px; color: #3a3a3a; }
  ol { display: flex; gap: 12px; list-style: none; }
  li { flex: 1; display: flex; flex-direction: column; gap: 6px; border-top: 4px solid #000091; padding-top: 14px; }
  .num { font-size: 20px; font-weight: 700; color: #000091; }
  .name { font-size: 28px; font-weight: 700; }
  .foot { display: flex; align-items: center; gap: 20px; margin-top: 26px; font-size: 20px; color: #666; }
  .badge { padding: 4px 12px; background: #feebd0; color: #7b3b00; font-size: 18px; font-weight: 700; text-transform: uppercase; }
</style>
<body>
  <div class="bar"></div>
  <div class="page">
    <div class="head"><span class="brand">ParcourTime</span><span class="url">parcourtime.wissem.pro</span></div>
    <div>
      <h1>Calendrier Parcoursup<br><span>${campaign.id.replace('-', '–')}</span></h1>
      <p class="lead">Phases, échéances et compte à rebours de la campagne.</p>
    </div>
    <div>
      <ol>${cells}</ol>
      <div class="foot">${estimated ? '<span class="badge">Dates estimées</span>' : ''}<span>Service indépendant, non affilié à Parcoursup.</span></div>
    </div>
  </div>
</body>
</html>`
}

const workDir = await mkdtemp(join(tmpdir(), 'parcourtime-og-'))
const html = join(workDir, 'og.html')
await writeFile(html, template())
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
try {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } })
  await page.goto(pathToFileURL(html).href)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: OUTPUT, type: 'png' })
  console.log(`og: ${campaign.id}`)
} finally {
  await browser.close()
}
