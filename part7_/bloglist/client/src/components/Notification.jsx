import { Alert } from '@mui/material'
import useNotificationStore from '../stores/notificationStore'

const Notification = () => {
  const message = useNotificationStore((state) => state.message)

  if (!message) return null

  return (
    <Alert severity={message.type} sx={{ marginY: 2 }}>
      {message.text}
    </Alert>
  )
}

export default Notification
