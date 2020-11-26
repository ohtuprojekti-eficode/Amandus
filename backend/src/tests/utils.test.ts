import {
  getFileNameFromFilePath,
  getRepositoryFromFilePath,
  makeCommitMessage,
  getRepoLocationFromUrlString,
  getRepoLocationFromRepoName,
} from '../utils/utils'

describe('Test getRepositoryFromFilePath', () => {
  it('returns correct repo from file', () => {
    const file = {
      name:
        'ohtuprojekti-eficode/robot-test-files/backend/src/tests/testfile.txt',
      content: 'test content',
    }
    const repoPath = getRepositoryFromFilePath(file)

    expect(repoPath).toBe('ohtuprojekti-eficode/robot-test-files')
  })
})

describe('Test getFileNameFromFilePath', () => {
  it('returns correct filename from file', () => {
    const file = {
      name:
        'ohtuprojekti-eficode/robot-test-files/backend/src/tests/testfile.txt',
      content: 'test content',
    }
    const repositoryName = 'ohtuprojekti-eficode/robot-test-files'
    const filename = getFileNameFromFilePath(file, repositoryName)

    expect(filename).toBe('backend/src/tests/testfile.txt')
  })
})

describe('Test makeCommitMessage', () => {
  it('commit message is the correct given message', () => {
    const originalCommitMessage = 'Add feature'
    const username = 'testuser'
    const realFilename = 'backend/src/folder/file.txt'

    const returnedCommitMessage = makeCommitMessage(
      originalCommitMessage,
      username,
      realFilename
    )
    expect(returnedCommitMessage).toBe(originalCommitMessage)
  })

  it('commit message defaults to correct message if given is empty', () => {
    const originalCommitMessage = ''
    const username = 'testuser'
    const realFilename = 'backend/src/folder/file.txt'

    const expectedCommitMessage = `User ${username} modified file ${realFilename}`

    const returnedCommitMessage = makeCommitMessage(
      originalCommitMessage,
      username,
      realFilename
    )
    expect(returnedCommitMessage).toBe(expectedCommitMessage)
  })
})

describe('Test getRepoLocationFromUrlString', () => {
  it('correct backend repository folder path is returned', () => {
    const urlString = 'https://github.com/ohtuprojekti-eficode/robot-test-files'
    const repoLocation = getRepoLocationFromUrlString(urlString)
    const expectedLocation =
      './repositories/ohtuprojekti-eficode/robot-test-files'
    expect(repoLocation).toBe(expectedLocation)
  })
})

describe('Test getRepoLocationFromRepoName', () => {
  it('correct backend repository folder path is returned', () => {
    const reponame = 'ohtuprojekti-eficode/robot-test-files'
    const repoLocation = getRepoLocationFromRepoName(reponame)
    const expectedLocation =
      './repositories/ohtuprojekti-eficode/robot-test-files'
    expect(repoLocation).toBe(expectedLocation)
  })
})
