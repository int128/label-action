# label-action [![ts](https://github.com/int128/label-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/label-action/actions/workflows/ts.yaml)

This is a General-purpose action for labels of issue or pull request.

## Getting Started

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/label-action@v1
        with:
          add-labels: needs-review
```

### Inputs

| Name            | Default               | Description                                                                        |
| --------------- | --------------------- | ---------------------------------------------------------------------------------- |
| `issue-number`  | `github.event.number` | The number of issue or pull request. Default to the current issue or pull request. |
| `add-labels`    | -                     | List of labels to add (multiline)                                                  |
| `remove-labels` | -                     | List of labels to remove (multiline)                                               |
| `token`         | `github.token`        | GitHub token                                                                       |

### Outputs

| Name             | Description                    |
| ---------------- | ------------------------------ |
| `added-labels`   | The labels added (multiline)   |
| `added-count`    | The number of labels added     |
| `removed-labels` | The labels removed (multiline) |
| `removed-count`  | The number of labels removed   |
