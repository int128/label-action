import * as core from '@actions/core'
import type { Octokit } from '@octokit/action'
import type * as github from './github.js'

export type Issue = {
  repo: {
    owner: string
    repo: string
  }
  number: number
  labels: string[]
}

export const getCurrentIssue = async (octokit: Octokit, context: github.Context): Promise<Issue | undefined> => {
  if ('issue' in context.payload) {
    return await getIssue(octokit, context, context.payload.issue.number)
  }

  if ('pull_request' in context.payload) {
    return await getIssue(octokit, context, context.payload.pull_request.number)
  }

  if ('workflow_run' in context.payload && context.payload.workflow_run) {
    core.info(`Current workflow_run ${context.payload.workflow_run.html_url}`)
    const pullNumber = context.payload.workflow_run.pull_requests.pop()?.number
    if (!pullNumber) {
      return
    }
    return await getIssue(octokit, context, pullNumber)
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
    return
  }
  core.info(`Found pull request ${pull.html_url}`)
  return {
    repo: context.repo,
    number: pull.number,
    labels: pull.labels.map((label) => label.name),
  }
}

const getIssue = async (octokit: Octokit, context: github.Context, issueNumber: number) => {
  core.info(`Fetching the current issue #${issueNumber}`)
  const { data: issue } = await octokit.rest.issues.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: issueNumber,
  })
  core.info(`Found issue ${issue.html_url}`)
  return {
    repo: context.repo,
    number: issue.number,
    labels: issue.labels.map((x) => (typeof x === 'object' ? x.name : x)).filter((x) => x !== undefined),
  }
}
