import { useState, useEffect } from 'react'
import {
  Routes, Route, Navigate, useNavigate, useMatch
} from 'react-router-dom'
import { Container } from '@mui/material'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Navigation from './components/Navigation'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })

    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  // Login
  const handleLogin = async credentials => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      showMessage('Login successful')
      navigate('/')
    } catch {
      showMessage('Wrong username or password', 'error')
    }
  }

  // Logout
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    setMessage(null)
    navigate('/')
  }

  // Add blog
  const addBlog = async blogObject => {
    try {
      const newBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(newBlog))

      showMessage(`A new blog ${newBlog.title} by ${newBlog.author} added`)

      navigate('/')
      return true
    } catch {
      showMessage('Failed to add blog', 'error')
      return false
    }
  }

  // Add like
  const addLike = async blog => {
    if (!user) {
      return
    }

    try {
      const updatedBlog = {
        user: blog.user?.id,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1
      }

      const returnedBlog = await blogService.update(
        blog.id,
        updatedBlog
      )

      setBlogs(blogs.map(b =>
        b.id === blog.id ? returnedBlog : b
      ))
    } catch {
      showMessage('Failed to update blog', 'error')
    }
  }

  // Remove blog
  const removeBlog = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)

        setBlogs(blogs.filter(b => b.id !== blog.id))

        showMessage(`Blog ${blog.title} removed`)
        navigate('/')
      } catch {
        showMessage('Failed to remove blog', 'error')
      }
    }
  }

  return (
    <Container>
      <Navigation user={user} logout={handleLogout} />

      <Notification message={message} />

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />

        <Route
          path="/login"
          element={user
            ? <Navigate to="/" replace />
            : <LoginForm login={handleLogin} />
          }
        />

        <Route
          path="/create"
          element={user
            ? <BlogForm createBlog={addBlog} />
            : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              user={user}
              addLike={addLike}
              removeBlog={removeBlog}
            />
          }
        />
      </Routes>
    </Container>
  )
}

export default App