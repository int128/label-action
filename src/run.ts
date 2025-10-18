import * as core from '@actions/core'
import type { Octokit } from '@octokit/action'
import type * as github from './github.js'
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
  added: boolean
  removedLabels: string[]
  removedCount: number
  removed: boolean
  matchedLabels: string[]
  matchedCount: number
  matched: boolean
}

export const run = async (inputs: Inputs, octokit: Octokit, context: github.Context): Promise<Outputs> => {
  const issue = await getCurrentIssue(octokit, context)
  if (issue === undefined) {
    return {
      addedLabels: [],
      addedCount: 0,
      added: false,
      removedLabels: [],
      removedCount: 0,
      removed: false,
      matchedLabels: [],
      matchedCount: 0,
      matched: false,
    }
  }

  core.info(`Current labels: ${issue.labels.join(', ')}`)
  const addedLabels = await addLabels(octokit, issue, inputs.addLabels)
  const removedLabels = await removeLabels(octokit, issue, inputs.removeLabels)
  const matchedLabels = matchLabels(issue, inputs.matchLabels)
  return {
    addedLabels,
    addedCount: addedLabels.length,
    added: addedLabels.length > 0,
    removedLabels,
    removedCount: removedLabels.length,
    removed: removedLabels.length > 0,
    matchedLabels,
    matchedCount: matchedLabels.length,
    matched: matchedLabels.length > 0,
  }
}
