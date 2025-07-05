import * as core from '@actions/core'
import * as github from './github.js'
import { run } from './run.js'

const main = async (): Promise<void> => {
  const outputs = await run(
    {
      issueNumber: Number.parseInt(core.getInput('issue-number')) || undefined,
      addLabels: core.getMultilineInput('add-labels'),
      removeLabels: core.getMultilineInput('remove-labels'),
      matchLabels: core.getMultilineInput('match-labels'),
    },
    github.getOctokit(),
    await github.getContext(),
  )
  core.info(`Outputs: ${JSON.stringify(outputs, null, 2)}`)
  core.setOutput('added-labels', outputs.addedLabels.join('\n'))
  core.setOutput('added-count', outputs.addedCount)
  core.setOutput('added', outputs.added)
  core.setOutput('removed-labels', outputs.removedLabels.join('\n'))
  core.setOutput('removed-count', outputs.removedCount)
  core.setOutput('removed', outputs.removed)
  core.setOutput('matched-labels', outputs.matchedLabels.join('\n'))
  core.setOutput('matched-count', outputs.matchedCount)
  core.setOutput('matched', outputs.matched)
}

main().catch((e: Error) => {
  core.setFailed(e)
  console.error(e)
})
