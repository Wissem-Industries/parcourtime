// Prepares a release: bun run release <x.y.z>
// Sets the version in package.json and in the files below, and turns the Unreleased
// section of the changelog into the new version.
import { readFileSync, writeFileSync } from 'node:fs'

const files = []

const fail = (message) => {
  console.error(message)
  process.exit(1)
}

const version = process.argv[2] ?? ''
if (!/^\d+\.\d+\.\d+$/.test(version)) fail('Usage: bun run release <major.minor.patch>')

const pkg = readFileSync('package.json', 'utf8')
const previous = JSON.parse(pkg).version
const parts = (value) => value.split('.').map(Number)
const [a, b] = [parts(version), parts(previous)]
const greater = a[0] - b[0] || a[1] - b[1] || a[2] - b[2]
if (greater <= 0) fail(`${version} must be greater than ${previous}`)

const changelog = readFileSync('CHANGELOG.md', 'utf8')
if (!changelog.includes('## [Unreleased]')) fail('CHANGELOG.md has no [Unreleased] section')

writeFileSync('package.json', pkg.replace(`"version": "${previous}"`, `"version": "${version}"`))
for (const file of files) {
  writeFileSync(file, readFileSync(file, 'utf8').replaceAll(`v${previous}`, `v${version}`))
}
const today = new Date().toISOString().slice(0, 10)
writeFileSync(
  'CHANGELOG.md',
  changelog.replace('## [Unreleased]', `## [Unreleased]\n\n## [${version}] - ${today}`),
)

console.log(`${previous} -> ${version}. Review CHANGELOG.md, then open the release pull request.`)
