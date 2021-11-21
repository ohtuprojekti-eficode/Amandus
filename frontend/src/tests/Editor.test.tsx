import { MockedProvider } from '@apollo/client/testing'
import { cleanup, render } from '@testing-library/react'
import React from 'react'
import Editor from '../components/editView/Editor'

// these bypass errors with mockedprovider component running out of mocks.
// better definitely exist, for example giving the mocked responses by hand
jest.mock('../hooks/useUser', () => () => ({ user: 'test', loading: false }))
jest.mock('./editView/ServiceConnected', () => () => <div />)

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
          isConflicted={false}
          fileContent={'content'}
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
          isConflicted={true}
          fileContent={'conflicted content'}
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
