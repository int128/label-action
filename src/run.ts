import * as core from '@actions/core'
import * as github from './github'

type Inputs = {
  issueNumber: number | undefined
  addLabels: string[]
  removeLabels: string[]
  token: string
}

type Outputs = {
  addedLabels: string[]
  removedLabels: string[]
}

export const run = async (inputs: Inputs, context: github.Context): Promise<Outputs> => {
  const octokit = github.getOctokit(inputs.token)
  const issueNumber = inputs.issueNumber ?? (await inferIssueNumberFromContext(octokit, context))

  let addedLabels: string[] = []
  if (inputs.addLabels.length > 0) {
    core.info(`Adding labels: ${inputs.addLabels.join(', ')}`)
    const response = await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
      labels: [...inputs.addLabels],
    })
    const allLabels = response.data.map((label) => label.name)
    addedLabels = intersect(inputs.addLabels, allLabels)
    core.info(`Added labels: ${addedLabels.join(', ')}`)
  }

  const removedLabels = []
  for (const label of inputs.removeLabels) {
    core.info(`Removing label: ${label}`)
    const response = await catchErrorStatus(
      404,
      octokit.rest.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber,
        name: label,
      }),
    )
    if (response) {
      core.info(`Removed label: ${label}`)
      removedLabels.push(label)
    }
  }

  return { addedLabels, removedLabels }
}

const intersect = <T>(a: T[], b: T[]): T[] => [...a].filter((x) => b.includes(x))

const inferIssueNumberFromContext = async (octokit: github.Octokit, context: github.Context): Promise<number> => {
  if (Number.isSafeInteger(context.issue.number)) {
    core.info(`Current issue or pull request is #${context.issue.number}`)
    return Number(context.issue.number)
  }
  core.info(`Find a pull request associated with the current commit ${context.sha}`)
  const { data: pulls } = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
    owner: context.repo.owner,
    repo: context.repo.repo,
    commit_sha: context.sha,
    per_page: 1,
  })
  const pull = pulls.pop()
  if (!pull) {
    throw new Error(`No pull request found for the current commit ${context.sha}`)
  }
  core.info(`Found pull request #${pull.number}: ${pull.html_url}`)
  return pull.number
}

const catchErrorStatus = async <T>(status: number, promise: Promise<T>): Promise<T | undefined> => {
  try {
    return await promise
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'status' in e && typeof e.status === 'number' && e.status === status) {
      return
    } else {
      throw e
    }
  }
}
