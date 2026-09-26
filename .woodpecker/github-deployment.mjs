const api = 'https://api.github.com'
const token = process.env.GITHUB_PACKAGES_TOKEN
const owner = process.env.CI_REPO_OWNER
const repository = process.env.CI_REPO_NAME
const { existsSync, readFileSync, writeFileSync } = await import('node:fs')
const deploymentFile = '/.woodpecker/github-deployment-id'

if (!token || !owner || !repository) {
  throw new Error('GitHub deployment credentials or repository metadata are missing.')
}

const request = async (path, body) => {
  const response = await fetch(`${api}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
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
    description: `Publication de ${process.env.CI_COMMIT_TAG} en cours`,
  })
} else if (process.argv[2] === 'success' || process.argv[2] === 'failure') {
  const path = `${process.env.CI_WORKSPACE}${deploymentFile}`
  if (!existsSync(path)) process.exit(0)
  const id = readFileSync(path, 'utf8').trim()
  if (!id) process.exit(0)
  await request(`${deploymentPath}/${id}/statuses`, statusBody(process.argv[2]))
} else {
  throw new Error('Expected start, success, or failure.')
}
