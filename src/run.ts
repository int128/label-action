import * as core from '@actions/core'
import * as github from './github'

type Inputs = {
  issueNumber: number
  addLabels: string[]
  removeLabels: string[]
  token: string
}

type Outputs = {
  addedLabels: string[]
  removedLabels: string[]
}

export const run = async (inputs: Inputs, context: github.Context): Promise<Outputs> => {
  if (!Number.isSafeInteger(inputs.issueNumber)) {
    throw new Error(`Invalid issue-number: ${inputs.issueNumber}`)
  }

  const octokit = github.getOctokit(inputs.token)

  let addedLabels: string[] = []
  if (inputs.addLabels.length > 0) {
    core.info(`Adding labels: ${inputs.addLabels.join(', ')}`)
    const response = await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: inputs.issueNumber,
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
        issue_number: inputs.issueNumber,
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
