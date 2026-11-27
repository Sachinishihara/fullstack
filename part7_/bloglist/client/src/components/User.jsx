import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, List, ListItem, ListItemText } from '@mui/material'
import userService from '../services/users'
import NotFound from './NotFound'

const User = () => {
  const { id } = useParams()
  const [users, setUsers] = useState(null)

  useEffect(() => {
    userService.getAll().then(setUsers)
  }, [])

  if (!users) return <div>loading...</div>

  const user = users.find((user) => user.id === id)

  if (!user) return <NotFound />

  return (
    <div>
      <Typography variant="h4" sx={{ marginY: 2 }}>
        {user.name}
      </Typography>

      <Typography variant="h6">added blogs</Typography>

      <List>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id}>
            <ListItemText primary={blog.title} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default User
