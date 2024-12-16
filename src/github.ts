import * as github from '@actions/github'
import { retry } from '@octokit/plugin-retry'

export type Octokit = ReturnType<typeof github.getOctokit>

export const getOctokit = (token: string): Octokit => github.getOctokit(token, {}, retry)

export type Context = typeof github.context

export const getContext = (): Context => github.context

export type WorkflowRunEvent = {
  html_url: string
  pull_requests: {
    number: number
  }[]
}
