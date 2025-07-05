# label-action [![ts](https://github.com/int128/label-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/label-action/actions/workflows/ts.yaml)

This is a General-purpose action for labels of issue or pull request.

## Getting Started

### Add labels

To add a label to the current issue,

```yaml
steps:
  - uses: int128/label-action@v1
    with:
      add-labels: needs-review
```

This action returns the added labels as `added-labels` output.
If the current issue already has a label, the output does not contain it.

You can determine if the labels have been really added as follows:

```yaml
steps:
  - uses: int128/label-action@v1
    id: add-deploy-label
    with:
      add-labels: deploy
  - if: steps.add-deploy-label.outputs.added == 'true'
    run: echo "The label has been really added"
```

### Remove labels

To remove a label from the current issue,

```yaml
steps:
  - uses: int128/label-action@v1
    with:
      remove-labels: needs-review
  - if: steps.remove-labels.outputs.removed == 'true'
    run: echo "The label has been really removed"
```

This action returns the removed labels as `removed-labels` output.
If the current issue does not have a label, the output does not contain it.

### Match labels

To get the labels matched to the patterns,

```yaml
steps:
  - uses: int128/label-action@v1
    id: has-deploy-label
    with:
      match-labels: |
        deploy
        /^deploy-/
  - if: steps.has-deploy-label.outputs.matched == 'true'
    run: echo "The issue has any deploy label"
```

If a pattern string is in the form of `/PATTERN/`, this action performs the regexp match.
Otherwise, this action performs the exact match.

## Specification

### Inputs

| Name            | Default           | Description                           |
| --------------- | ----------------- | ------------------------------------- |
| `issue-number`  | The current issue | The number of issue or pull request   |
| `add-labels`    | -                 | List of labels to add (multiline)     |
| `remove-labels` | -                 | List of labels to remove (multiline)  |
| `match-labels`  | -                 | List of patterns to match (multiline) |
| `token`         | `github.token`    | GitHub token                          |

This action determines the current issue as follows:

- For `pull_request`, `pull_request_target` or `pull_request_review` event,
  this action finds the current pull request from event.
- For `issue` or `issue_comment` event,
  this action finds the current issue from event.
- For `workflow_run` event, this action finds the target pull request from event.
  If no pull request is found, this action does nothing.
- For other events, this action finds a pull request associated to the current commit.
  If no pull request is found, this action does nothing.

### Outputs

| Name             | Description                                             |
| ---------------- | ------------------------------------------------------- |
| `added-labels`   | The labels added (multiline)                            |
| `added-count`    | The number of labels added                              |
| `added`          | If the labels were added, `true`. Otherwise, `false`.   |
| `removed-labels` | The labels removed (multiline)                          |
| `removed-count`  | The number of labels removed                            |
| `removed`        | If the labels were removed, `true`. Otherwise, `false`. |
| `matched-labels` | The labels matched (multiline)                          |
| `matched-count`  | The number of labels matched                            |
| `matched`        | If the labels were matched, `true`. Otherwise, `false`. |
