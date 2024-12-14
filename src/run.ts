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
  addedCount: number
  removedLabels: string[]
  removedCount: number
}

export const run = async (inputs: Inputs, rawContext: github.Context): Promise<Outputs> => {
  const octokit = github.getOctokit(inputs.token)
  const context = await inferContext(octokit, rawContext)
  const addedLabels = await addLabels(octokit, context, inputs.addLabels)
  const removedLabels = await removeLabels(octokit, context, inputs.removeLabels)
  return {
    addedLabels,
    addedCount: addedLabels.length,
    removedLabels,
    removedCount: removedLabels.length,
  }
}

const addLabels = async (octokit: github.Octokit, context: github.Context, labels: string[]) => {
  if (labels.length === 0) {
    return []
  }
  core.info(`Adding labels: ${labels.join(', ')}`)
  const response = await octokit.rest.issues.addLabels({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    labels,
  })
  const allLabels = response.data.map((label) => label.name)
  return intersect(labels, allLabels)
}

const removeLabels = async (octokit: github.Octokit, context: github.Context, labels: string[]) => {
  const removedLabels = []
  for (const label of labels) {
    core.info(`Removing label: ${label}`)
    const response = await catchErrorStatus(
      404,
      octokit.rest.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        name: label,
      }),
    )
    if (response) {
      core.info(`Removed label: ${label}`)
      removedLabels.push(label)
    }
  }
  return removedLabels
}

const intersect = <T>(a: T[], b: T[]): T[] => [...a].filter((x) => b.includes(x))

const inferContext = async (octokit: github.Octokit, context: github.Context): Promise<github.Context> => {
  if (Number.isSafeInteger(context.issue.number)) {
    core.info(`Current issue or pull request is #${context.issue.number}`)
    return context
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
  return {
    ...context,
    issue: {
      number: pull.number,
    },
  }
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
