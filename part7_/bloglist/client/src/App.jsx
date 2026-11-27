import { useEffect, useState } from 'react'
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useMatch,
  useLocation
} from 'react-router-dom'
import { Container } from '@mui/material'

import Blog from './components/Blog'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Navigation from './components/Navigation'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import Users from './components/Users'
import User from './components/User'

import useBlogStore from './stores/blogStore'
import useUserStore from './stores/userStore'
import useNotificationStore from './stores/notificationStore'

const App = () => {
  const blogs = useBlogStore((state) => state.blogs)
  const initialize = useBlogStore((state) => state.initialize)
  const createBlog = useBlogStore((state) => state.addBlog)
  const likeBlog = useBlogStore((state) => state.addLike)
  const deleteBlog = useBlogStore((state) => state.removeBlog)
  const commentBlog = useBlogStore((state) => state.addComment)

  const user = useUserStore((state) => state.user)
  const login = useUserStore((state) => state.login)
  const logout = useUserStore((state) => state.logout)

  const showMessage = useNotificationStore((state) => state.showMessage)
  const clearMessage = useNotificationStore((state) => state.clearMessage)

  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const location = useLocation()
  const match = useMatch('/blogs/:id')

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null

  useEffect(() => {
    initialize()
      .catch(() => showMessage('Failed to load blogs', 'error'))
      .finally(() => setLoading(false))
  }, [initialize, showMessage])

  const handleLogin = async (credentials) => {
    try {
      await login(credentials)
      showMessage('Login successful')
      navigate('/')
    } catch {
      showMessage('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    logout()
    clearMessage()
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      const created = await createBlog(blogObject)

      showMessage(`A new blog ${created.title} by ${created.author} added`)

      navigate('/')
      return true
    } catch {
      showMessage('Failed to add blog', 'error')
      return false
    }
  }

  const addLike = async (blog) => {
    if (!user) return

    try {
      await likeBlog(blog)
    } catch {
      showMessage('Failed to update blog', 'error')
    }
  }

  const removeBlog = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      return
    }

    try {
      await deleteBlog(blog.id)
      showMessage(`Blog ${blog.title} removed`)
      navigate('/')
    } catch {
      showMessage('Failed to remove blog', 'error')
    }
  }

  const addComment = async (id, comment) => {
    try {
      await commentBlog(id, comment)
    } catch {
      showMessage('Failed to add comment', 'error')
    }
  }

  return (
    <Container>
      <Navigation user={user} logout={handleLogout} />

      <ErrorBoundary key={location.pathname}>
        <Notification />

        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} />} />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <LoginForm login={handleLogin} />
              )
            }
          />

          <Route
            path="/create"
            element={
              user ? (
                <BlogForm createBlog={addBlog} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/blogs/:id"
            element={
              loading ? (
                <div>loading...</div>
              ) : (
                <Blog
                  blog={blog}
                  user={user}
                  addLike={addLike}
                  removeBlog={removeBlog}
                  addComment={addComment}
                />
              )
            }
          />

          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
