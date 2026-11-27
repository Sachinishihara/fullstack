import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography } from '@mui/material'

const Navigation = ({ user, logout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>

        <Button color="inherit" component={Link} to="/users">
          users
        </Button>

        {user ? (
          <>
            <Button color="inherit" component={Link} to="/create">
              new blog
            </Button>

            <Typography sx={{ marginLeft: 'auto' }}>
              {user.name} logged in
            </Typography>

            <Button color="inherit" onClick={logout}>
              logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
