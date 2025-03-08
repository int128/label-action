import assert from 'assert'
import * as fs from 'fs/promises'
import { Octokit } from '@octokit/action'
import { WebhookEvent } from '@octokit/webhooks-types'
import { retry } from '@octokit/plugin-retry'

export const getOctokit = () => new (Octokit.plugin(retry))()

export type Context = {
  repo: {
    owner: string
    repo: string
  }
  eventName: string
  sha: string
  payload: WebhookEvent
}

export const getContext = async (): Promise<Context> => {
  // https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#default-environment-variables
  assert(process.env.GITHUB_REPOSITORY, 'GITHUB_REPOSITORY is required')
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/')

  assert(process.env.GITHUB_EVENT_PATH, 'GITHUB_EVENT_PATH is required')
  const payload = JSON.parse(await fs.readFile(process.env.GITHUB_EVENT_PATH, 'utf-8')) as WebhookEvent

  assert(process.env.GITHUB_EVENT_NAME, 'GITHUB_EVENT_NAME is required')
  assert(process.env.GITHUB_SHA, 'GITHUB_SHA is required')

  return {
    repo: { owner, repo },
    eventName: process.env.GITHUB_EVENT_NAME,
    payload,
    sha: process.env.GITHUB_SHA,
  }
}
