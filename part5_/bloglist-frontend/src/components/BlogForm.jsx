import { useState } from 'react'
import { TextField, Button, Stack, Typography } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async event => {
    event.preventDefault()

    const success = await createBlog({
      title,
      author,
      url
    })

    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <div>
      <Typography variant="h5" sx={{ marginY: 2 }}>
        create new blog
      </Typography>

      <form onSubmit={addBlog}>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField
            label="title:"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />

          <TextField
            label="author:"
            value={author}
            onChange={event => setAuthor(event.target.value)}
          />

          <TextField
            label="url:"
            value={url}
            onChange={event => setUrl(event.target.value)}
          />

          <Button type="submit" variant="contained">
            create
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default BlogForm