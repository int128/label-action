import { describe, expect, it } from 'vitest'
import { getLabelsToAdd, getLabelsToRemove, matchLabels } from '../src/label.js'

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

describe('matchLabels', () => {
  it.each([
    { currentLabels: [], patterns: [], matched: [] },
    { currentLabels: [], patterns: ['foo'], matched: [] },
    { currentLabels: ['foo'], patterns: [], matched: [] },
    { currentLabels: ['foo'], patterns: ['foo'], matched: ['foo'] },
    { currentLabels: ['foo'], patterns: ['/oo$/'], matched: ['foo'] },
    { currentLabels: ['foo', 'boo'], patterns: ['/oo$/'], matched: ['foo', 'boo'] },
    { currentLabels: ['foo', 'bar'], patterns: ['/oo$/'], matched: ['foo'] },
    { currentLabels: ['foo', 'bar'], patterns: ['bar', '/oo$/'], matched: ['foo', 'bar'] },
  ])('returns the matched labels', ({ currentLabels, patterns, matched }) => {
    expect(matchLabels({ labels: currentLabels }, patterns)).toStrictEqual(matched)
  })
})
