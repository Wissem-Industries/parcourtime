const api = 'https://api.github.com'
const token = process.env.GITHUB_PACKAGES_TOKEN
const owner = process.env.CI_REPO_OWNER
const repository = process.env.CI_REPO_NAME
const { existsSync, readFileSync, writeFileSync } = await import('node:fs')
const deploymentFile = '/.woodpecker/github-deployment-id'

if (!token || !owner || !repository) {
  throw new Error('GitHub deployment credentials or repository metadata are missing.')
}

const request = async (path, body, method = 'POST') => {
  const response = await fetch(`${api}${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`GitHub deployment API returned ${response.status}: ${detail}`)
  }

  return response.json()
}

const deploymentPath = `/repos/${owner}/${repository}/deployments`
const statusBody = (state) => ({
  state,
  log_url: process.env.CI_PIPELINE_URL,
  description: process.env.DEPLOYMENT_STATUS_DESCRIPTION,
  environment_url: process.env.DEPLOYMENT_URL || undefined,
  auto_inactive: false,
})

if (process.argv[2] === 'start') {
  const deployment = await request(deploymentPath, {
    ref: process.env.CI_COMMIT_SHA,
    task: process.env.DEPLOYMENT_TASK,
    auto_merge: false,
    required_contexts: [],
    environment: process.env.DEPLOYMENT_ENVIRONMENT,
    description: `Release ${process.env.CI_COMMIT_TAG}`,
    production_environment: process.env.DEPLOYMENT_PRODUCTION === 'true',
    transient_environment: false,
  })
  writeFileSync(`${process.env.CI_WORKSPACE}${deploymentFile}`, String(deployment.id))
  await request(`${deploymentPath}/${deployment.id}/statuses`, {
    state: 'in_progress',
    log_url: process.env.CI_PIPELINE_URL,
    description: `Publishing ${process.env.CI_COMMIT_TAG}`,
  })
} else if (process.argv[2] === 'release') {
  const tag = process.env.CI_COMMIT_TAG
  const semver =
    /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/
  if (!tag || !semver.test(tag)) {
    throw new Error('A semantic version tag is required to publish a GitHub release.')
  }
  const releasePath = `/repos/${owner}/${repository}/releases/tags/${encodeURIComponent(tag)}`
  const existing = await request(releasePath, undefined, 'GET').catch((error) => {
    if (error.message.includes('returned 404')) return null
    throw error
  })
  if (existing) process.exit(0)
  const changelog = existsSync('CHANGELOG.md') ? readFileSync('CHANGELOG.md', 'utf8') : ''
  const heading = changelog.indexOf(`## [${tag.slice(1)}]`)
  const notes =
    heading === -1
      ? ''
      : changelog
          .slice(changelog.indexOf('\n', heading) + 1)
          .split(/\n## \[/)[0]
          .trim()
  await request(`/repos/${owner}/${repository}/releases`, {
    tag_name: tag,
    name: tag,
    body: notes,
    generate_release_notes: !notes,
    draft: false,
    prerelease: tag.includes('-'),
  })
} else if (process.argv[2] === 'success' || process.argv[2] === 'failure') {
  const path = `${process.env.CI_WORKSPACE}${deploymentFile}`
  if (!existsSync(path)) process.exit(0)
  const id = readFileSync(path, 'utf8').trim()
  if (!id) process.exit(0)
  await request(`${deploymentPath}/${id}/statuses`, statusBody(process.argv[2]))
} else {
  throw new Error('Expected start, release, success, or failure.')
}
