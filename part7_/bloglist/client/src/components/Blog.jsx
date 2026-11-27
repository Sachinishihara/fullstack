import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import { useField } from '../hooks'
import NotFound from './NotFound'

const Blog = ({ blog, user, addLike, removeBlog, addComment }) => {
  const comment = useField('text')

  if (!blog) return <NotFound />

  const handleComment = async (event) => {
    event.preventDefault()

    if (!comment.value.trim()) return

    await addComment(blog.id, comment.value)
    comment.reset()
  }

  return (
    <Card sx={{ marginTop: 2 }}>
      <CardContent>
        <Typography variant="h4">{blog.title}</Typography>
        <Typography variant="h6">{blog.author}</Typography>

        <Typography sx={{ marginY: 2 }}>
          <a href={blog.url}>{blog.url}</a>
        </Typography>

        <Typography>likes {blog.likes}</Typography>

        <Typography sx={{ marginY: 2 }}>added by {blog.user?.name}</Typography>

        <Stack direction="row" spacing={2}>
          {user && (
            <Button variant="contained" onClick={() => addLike(blog)}>
              like
            </Button>
          )}

          {user && blog.user?.username === user.username && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeBlog(blog)}
            >
              remove
            </Button>
          )}
        </Stack>

        <Typography variant="h5" sx={{ marginY: 2 }}>
          comments
        </Typography>

        {addComment && (
          <form onSubmit={handleComment}>
            <Stack direction="row" spacing={2}>
              <TextField label="comment" {...comment.input} />
              <Button type="submit" variant="contained">
                add comment
              </Button>
            </Stack>
          </form>
        )}

        <List>
          {(blog.comments || []).map((comment, index) => (
            <ListItem key={index}>
              <ListItemText primary={comment} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default Blog
