import { getLabelsToAdd, getLabelsToRemove } from '../src/label'

describe('getLabelsToAdd', () => {
  it.each([
    { currentLabels: [], requestedLabels: [], labelsToAdd: [] },
    { currentLabels: [], requestedLabels: ['foo'], labelsToAdd: ['foo'] },
    { currentLabels: ['foo'], requestedLabels: ['foo'], labelsToAdd: [] },
    { currentLabels: ['foo'], requestedLabels: [], labelsToAdd: [] },
    { currentLabels: ['foo'], requestedLabels: ['bar'], labelsToAdd: ['bar'] },
    { currentLabels: ['foo', 'bar'], requestedLabels: ['foo'], labelsToAdd: [] },
    { currentLabels: ['foo', 'bar'], requestedLabels: ['bar'], labelsToAdd: [] },
    { currentLabels: ['foo', 'bar'], requestedLabels: ['bar', 'foo'], labelsToAdd: [] },
  ])('returns the labels to add', ({ currentLabels, requestedLabels, labelsToAdd }) => {
    expect(getLabelsToAdd(currentLabels, requestedLabels)).toStrictEqual(labelsToAdd)
  })
})

describe('getLabelsToRemove', () => {
  it.each([
    { currentLabels: [], requestedLabels: [], labelsToRemove: [] },
    { currentLabels: [], requestedLabels: ['foo'], labelsToRemove: [] },
    { currentLabels: ['foo'], requestedLabels: ['foo'], labelsToRemove: ['foo'] },
    { currentLabels: ['foo'], requestedLabels: [], labelsToRemove: [] },
    { currentLabels: ['foo'], requestedLabels: ['bar'], labelsToRemove: [] },
    { currentLabels: ['foo', 'bar'], requestedLabels: ['foo'], labelsToRemove: ['foo'] },
    { currentLabels: ['foo', 'bar'], requestedLabels: ['bar'], labelsToRemove: ['bar'] },
    { currentLabels: ['foo', 'bar'], requestedLabels: ['bar', 'foo'], labelsToRemove: ['bar', 'foo'] },
  ])('returns the labels to remove', ({ currentLabels, requestedLabels, labelsToRemove }) => {
    expect(getLabelsToRemove(currentLabels, requestedLabels)).toStrictEqual(labelsToRemove)
  })
})
