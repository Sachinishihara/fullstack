import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [login] = useMutation(LOGIN)

  const submit = async event => {
    event.preventDefault()

    try {
      const result = await login({
        variables: { username, password }
      })

      const token = result.data.login.value

      localStorage.setItem('library-user-token', token)
      setToken(token)
      setPage('authors')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div>
      <h2>login</h2>

      {error && <p>{error}</p>}

      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
