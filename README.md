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
  - if: steps.add-deploy-label.outputs.added-count > 0
    run: echo "The label has been really added"
```

### Remove labels

To remove a label from the current issue,

```yaml
steps:
  - uses: int128/label-action@v1
    with:
      remove-labels: needs-review
```

This action returns the removed labels as `removed-labels` output.
If the current issue does not have a label, the output does not contain it.

## Specification

### Inputs

| Name            | Default           | Description                          |
| --------------- | ----------------- | ------------------------------------ |
| `issue-number`  | The current issue | The number of issue or pull request  |
| `add-labels`    | -                 | List of labels to add (multiline)    |
| `remove-labels` | -                 | List of labels to remove (multiline) |
| `token`         | `github.token`    | GitHub token                         |

This action determines the current issue as follows:

- On `pull_request` event, this action manipulates the current pull request.
- On `issue` event, this action manipulates the current issue.
- On other events, this action finds a pull request associated to the current commit.
  If no pull request is found, this action fails.

### Outputs

| Name             | Description                    |
| ---------------- | ------------------------------ |
| `added-labels`   | The labels added (multiline)   |
| `added-count`    | The number of labels added     |
| `removed-labels` | The labels removed (multiline) |
| `removed-count`  | The number of labels removed   |
