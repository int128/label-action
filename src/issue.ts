import * as core from '@actions/core'
import * as github from './github'

export type Issue = {
  repo: {
    owner: string
    repo: string
  }
  number: number
  labels: string[]
}

export const getCurrentIssue = async (octokit: github.Octokit, context: github.Context): Promise<Issue> => {
  if (Number.isSafeInteger(context.issue.number)) {
    core.info(`Fetching the current issue #${context.issue.number}`)
    const { data: issue } = await octokit.rest.issues.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
    })
    core.info(`Found issue ${issue.html_url}`)
    return {
      repo: context.repo,
      number: issue.number,
      labels: issue.labels.map((x) => (typeof x === 'object' ? x.name : x)).filter((x) => x !== undefined),
    }
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
  core.info(`Found pull request ${pull.html_url}`)
  return {
    repo: context.repo,
    number: pull.number,
    labels: pull.labels.map((label) => label.name),
  }
}
