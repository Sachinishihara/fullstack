import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  return (
    <Alert severity={message.type} sx={{ marginY: 2 }}>
      {message.text}
    </Alert>
  )
}

export default Notification