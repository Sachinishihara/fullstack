import { TextField, Button, Stack, Typography } from '@mui/material'
import { useField } from '../hooks'

const BlogForm = ({ createBlog }) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const addBlog = async (event) => {
    event.preventDefault()

    const success = await createBlog({
      title: title.value,
      author: author.value,
      url: url.value
    })

    if (success) {
      title.reset()
      author.reset()
      url.reset()
    }
  }

  return (
    <div>
      <Typography variant="h5" sx={{ marginY: 2 }}>
        create new blog
      </Typography>

      <form onSubmit={addBlog}>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField label="title:" {...title.input} />
          <TextField label="author:" {...author.input} />
          <TextField label="url:" {...url.input} />

          <Button type="submit" variant="contained">
            create
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default BlogForm
