import * as core from '@actions/core'
import * as github from './github'
import { run } from './run.js'

const main = async (): Promise<void> => {
  const outputs = await run(
    {
      issueNumber: parseInt(core.getInput('issue-number', { required: true })),
      addLabels: core.getMultilineInput('add-labels'),
      removeLabels: core.getMultilineInput('remove-labels'),
      token: core.getInput('token', { required: true }),
    },
    github.getContext(),
  )
  core.info(`Outputs: ${JSON.stringify(outputs)}`)
  core.setOutput('added-labels', outputs.addedLabels.join('\n'))
  core.setOutput('added-count', outputs.addedLabels.length)
  core.setOutput('removed-labels', outputs.removedLabels.join('\n'))
  core.setOutput('removed-count', outputs.removedLabels.length)
}

main().catch((e: Error) => {
  core.setFailed(e)
  console.error(e)
})
