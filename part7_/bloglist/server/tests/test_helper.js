const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Learning React',
    author: 'John Smith',
    url: 'https://example.com/react',
    likes: 5
  },
  {
    title: 'Learning Node',
    author: 'Anna Smith',
    url: 'https://example.com/node',
    likes: 3
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}