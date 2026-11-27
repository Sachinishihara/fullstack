import { Card, CardContent, Typography, Button, Stack } from '@mui/material'

const Blog = ({ blog, user, addLike, removeBlog }) => {
  if (!blog) {
    return null
  }

  return (
    <Card sx={{ marginTop: 2 }}>
      <CardContent>
        <Typography variant="h4">
          {blog.title}
        </Typography>

        <Typography variant="h6">
          {blog.author}
        </Typography>

        <Typography sx={{ marginY: 2 }}>
          <a href={blog.url}>{blog.url}</a>
        </Typography>

        <Typography>
          likes {blog.likes}
        </Typography>

        <Typography sx={{ marginY: 2 }}>
          added by {blog.user?.name}
        </Typography>

        <Stack direction="row" spacing={2}>
          {user && (
            <Button
              variant="contained"
              onClick={() => addLike(blog)}
            >
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
      </CardContent>
    </Card>
  )
}

export default Blog