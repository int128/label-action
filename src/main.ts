import * as core from '@actions/core'
import * as github from './github'
import { run } from './run.js'

const main = async (): Promise<void> => {
  const outputs = await run(
    {
      issueNumber: Number.parseInt(core.getInput('issue-number')) || undefined,
      addLabels: core.getMultilineInput('add-labels'),
      removeLabels: core.getMultilineInput('remove-labels'),
      matchLabels: core.getMultilineInput('match-labels'),
      token: core.getInput('token', { required: true }),
    },
    github.getContext(),
  )
  core.info(`Outputs: ${JSON.stringify(outputs)}`)
  core.setOutput('added-labels', outputs.addedLabels.join('\n'))
  core.setOutput('added-count', outputs.addedCount)
  core.setOutput('removed-labels', outputs.removedLabels.join('\n'))
  core.setOutput('removed-count', outputs.removedCount)
}

main().catch((e: Error) => {
  core.setFailed(e)
  console.error(e)
})
