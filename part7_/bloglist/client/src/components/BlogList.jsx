import { Link } from 'react-router-dom'
import {
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography
} from '@mui/material'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <Typography variant="h4" sx={{ marginY: 2 }}>
        blogs
      </Typography>

      <Paper>
        <List>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <ListItemButton
                key={blog.id}
                component={Link}
                to={`/blogs/${blog.id}`}
                divider
              >
                <ListItemText primary={`${blog.title} ${blog.author}`} />
              </ListItemButton>
            ))}
        </List>
      </Paper>
    </div>
  )
}

export default BlogList
