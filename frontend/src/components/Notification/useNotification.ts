import React from 'react'
import { NotificationContext } from './NotificationProvider'

const useNotification = () => React.useContext(NotificationContext)

export default useNotification
