import { render } from '@testing-library/react'
import React from 'react'

import Notification from '../components/Notification/Notification'
import useNotification from '../components/Notification/useNotification'

const mockHook = useNotification as jest.Mock

jest.mock('../components/Notification/useNotification', () => jest.fn())

describe('Notifications', () => {
  it('should not be visible by default', () => {
    mockHook.mockReturnValueOnce({
      notification: null,
    })

    const { container } = render(<Notification />)

    const notification = container.querySelector('#app-wide-notification')

    expect(notification).not.toBeInTheDocument()
  })

  it('should be visible when set', () => {
    const mockNotification = {
      text: 'test text',
      isError: false,
    }

    mockHook.mockReturnValueOnce({
      notification: mockNotification,
      autoHideDelay: 5000,
      handleClose: jest.fn(),
    })

    const { container } = render(<Notification />)

    const notification = container.querySelector('#app-wide-notification')

    expect(notification).toBeInTheDocument()
  })
})
