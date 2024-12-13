import * as github from '@actions/github'
import { retry } from '@octokit/plugin-retry'

export type Octokit = ReturnType<typeof github.getOctokit>

export const getOctokit = (token: string): Octokit => github.getOctokit(token, {}, retry)

export type Context = {
  repo: {
    owner: string
    repo: string
  }
}

export const getContext = (): Context => github.context
