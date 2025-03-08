import * as core from '@actions/core'
import * as github from './github.js'
import { Octokit } from '@octokit/action'
import { getCurrentIssue } from './issue.js'
import { addLabels, matchLabels, removeLabels } from './label.js'

type Inputs = {
  issueNumber: number | undefined
  addLabels: string[]
  removeLabels: string[]
  matchLabels: string[]
}

type Outputs = {
  addedLabels: string[]
  addedCount: number
  removedLabels: string[]
  removedCount: number
  matchedLabels: string[]
  matchedCount: number
}

export const run = async (inputs: Inputs, octokit: Octokit, context: github.Context): Promise<Outputs> => {
  const issue = await getCurrentIssue(octokit, context)
  if (issue === undefined) {
    return {
      addedLabels: [],
      addedCount: 0,
      removedLabels: [],
      removedCount: 0,
      matchedLabels: [],
      matchedCount: 0,
    }
  }

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
