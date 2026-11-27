import { TextField, Button, Stack, Typography } from '@mui/material'
import { useField } from '../hooks'

const LoginForm = ({ login }) => {
  const username = useField('text')
  const password = useField('password')

  const handleSubmit = (event) => {
    event.preventDefault()

    login({
      username: username.value,
      password: password.value
    })
  }

  return (
    <div>
      <Typography variant="h5" sx={{ marginY: 2 }}>
        Log in to application
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField label="username" {...username.input} />
          <TextField label="password" {...password.input} />
          <Button type="submit" variant="contained">
            login
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default LoginForm
