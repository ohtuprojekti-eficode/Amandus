import React from 'react'
import Editor from '../components/Editor'
import { MockedProvider } from '@apollo/client/testing'
import { render, cleanup } from '@testing-library/react'

// these bypass errors with mockedprovider component running out of mocks.
// better definitely exist, for example giving the mocked responses by hand
jest.mock('../hooks/useUser', () => () => ({ user: 'test', loading: false }))
jest.mock('../components/ServiceConnected', () => () => <div />)

const unConflictedContent =
  'just\n' + 'normal\n' + 'unconflicted\n' + 'content\n'

const conflictedContent =
  '<<<<<<< HEAD\n' +
  'current changes\n' +
  '=======\n' +
  'incoming changes\n' +
  '>>>>>>> commit id\n'

const filename = 'filename'
const commitMessage = 'commitMessage'
const currentBranch = 'currentBranch'
const onMergeError = jest.fn()
const cloneUrl = 'testUrl'
const currentService = 'github'

describe('Editor -component', () => {
  afterEach(() => cleanup())

  it('renders normal editor when there is no conflict', async () => {
    const { getByText } = render(
      <MockedProvider>
        <Editor
          fileContent={unConflictedContent}
          filename={filename}
          commitMessage={commitMessage}
          cloneUrl={cloneUrl}
          onMergeError={onMergeError}
          currentBranch={currentBranch}
          currentService={currentService}
        />
      </MockedProvider>
    )

    const saveButton = getByText('Save')

    expect(saveButton).toBeInTheDocument()
  })

  it('renders diff editor when there is a conflict', async () => {
    const { getByText } = render(
      <MockedProvider>
        <Editor
          fileContent={conflictedContent}
          filename={filename}
          commitMessage={commitMessage}
          cloneUrl={cloneUrl}
          onMergeError={onMergeError}
          currentBranch={currentBranch}
          currentService={currentService}
        />
      </MockedProvider>
    )

    const mergeButton = getByText('Merge')

    expect(mergeButton).toBeInTheDocument()
  })
})
