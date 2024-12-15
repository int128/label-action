import * as core from '@actions/core'
import * as github from './github'
import { Issue } from './issue'

export const addLabels = async (octokit: github.Octokit, issue: Issue, labels: string[]) => {
  if (labels.length === 0) {
    return []
  }
  const labelsToAdd = getLabelsToAdd(issue.labels, labels)
  if (labelsToAdd.length === 0) {
    core.info(`The issue already has the labels ${labels.join(', ')}`)
    return []
  }

  core.info(`Adding labels: ${labelsToAdd.join(', ')}`)
  await octokit.rest.issues.addLabels({
    owner: issue.repo.owner,
    repo: issue.repo.repo,
    issue_number: issue.number,
    labels: labelsToAdd,
  })
  return labelsToAdd
}

export const getLabelsToAdd = (currentLabels: string[], requestedLabels: string[]) =>
  requestedLabels.filter((label) => !currentLabels.includes(label))

export const removeLabels = async (octokit: github.Octokit, issue: Issue, labels: string[]) => {
  if (labels.length === 0) {
    return []
  }
  const labelsToRemove = getLabelsToRemove(issue.labels, labels)
  if (labelsToRemove.length === 0) {
    core.info(`The issue does not have any labels of ${labels.join(', ')}`)
    return []
  }

  core.info(`Removing labels: ${labelsToRemove.join(', ')}`)
  const removedLabels = []
  for (const label of labelsToRemove) {
    const response = await catchStatusError(
      404,
      octokit.rest.issues.removeLabel({
        owner: issue.repo.owner,
        repo: issue.repo.repo,
        issue_number: issue.number,
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

export const getLabelsToRemove = (currentLabels: string[], requestedLabels: string[]) =>
  requestedLabels.filter((label) => currentLabels.includes(label))

const catchStatusError = async <T>(status: number, promise: Promise<T>): Promise<T | undefined> => {
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
