import React from 'react'

interface Notification {
  text: string
  isError: boolean
}

interface NotificationContextType {
  notify: (text: string, isError?: boolean) => void
  notification: Notification | null
  handleClose: () => void
  autoHideDelay: number
}

const AUTO_HIDE_DELAY = 5000

const NotificationContext = React.createContext<NotificationContextType>({
  notify: () => null,
  notification: null,
  handleClose: () => null,
  autoHideDelay: AUTO_HIDE_DELAY,
})

export const useNotification = () => React.useContext(NotificationContext)

const NotificationProvider: React.FC = ({ children }) => {
  const [notification, setNotification] = React.useState<Notification | null>(
    null
  )

  const notify = (text: string, isError: boolean = false) => {
    const newNotification = {
      text,
      isError,
    }

    setNotification(newNotification)
  }

  const handleClose = () => setNotification(null)

  return (
    <NotificationContext.Provider
      value={{
        notify,
        notification,
        handleClose,
        autoHideDelay: AUTO_HIDE_DELAY,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
