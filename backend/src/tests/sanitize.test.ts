import { sanitizeCommitMessage, sanitizeBranchName } from '../utils/sanitize'

describe('Sanitize commit message', () => {
  test('Strips all special characters except , and .', () => {
    const dirtyMessage = `This is a commit message{}/\\[]£$$$%%@@^**~||, hello.`
    const sanitizedMessage = sanitizeCommitMessage(dirtyMessage)

    expect(sanitizedMessage).toBe('This is a commit message, hello.')
  })
})

describe('Sanitize branch name', () => {
  test('Strips all special characters except -', () => {
    const dirtyMessage = `-this-is-a-branch-name{}/\\[]£$$$%%@@^**~||,`
    const sanitizedMessage = sanitizeBranchName(dirtyMessage)

    expect(sanitizedMessage).toBe('this-is-a-branch-name')
  })
})
