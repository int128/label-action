import * as core from '@actions/core'
import * as github from './github'
import { getCurrentIssue } from './issue'
import { addLabels, matchLabels, removeLabels } from './label'

type Inputs = {
  issueNumber: number | undefined
  addLabels: string[]
  removeLabels: string[]
  matchLabels: string[]
  token: string
}

type Outputs = {
  addedLabels: string[]
  addedCount: number
  removedLabels: string[]
  removedCount: number
  matchedLabels: string[]
  matchedCount: number
}

export const run = async (inputs: Inputs, context: github.Context): Promise<Outputs> => {
  const octokit = github.getOctokit(inputs.token)
  const issue = await getCurrentIssue(octokit, context)
  core.info(`Current labels: ${issue.labels.join(', ')}`)
  const addedLabels = await addLabels(octokit, issue, inputs.addLabels)
  const removedLabels = await removeLabels(octokit, issue, inputs.removeLabels)
  const matchedLabels = matchLabels(issue, inputs.matchLabels)
  return {
    addedLabels,
    addedCount: addedLabels.length,
    removedLabels,
    removedCount: removedLabels.length,
    matchedLabels,
    matchedCount: matchedLabels.length,
  }
}
