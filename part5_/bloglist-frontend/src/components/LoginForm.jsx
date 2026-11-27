import { useState } from 'react'
import { TextField, Button, Stack, Typography } from '@mui/material'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    login({ username, password })
  }

  return (
    <div>
      <Typography variant="h5" sx={{ marginY: 2 }}>
        Log in to application
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField
            label="username"
            value={username}
            onChange={event => setUsername(event.target.value)}
          />

          <TextField
            label="password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />

          <Button type="submit" variant="contained">
            login
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default LoginForm