const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret123', 10)

  const user = new User({
    username: 'root',
    name: 'Root User',
    passwordHash
  })

  await user.save()

  const blogs = await Blog.insertMany(
    helper.initialBlogs.map(blog => ({
      ...blog,
      user: user._id
    }))
  )

  user.blogs = blogs.map(blog => blog._id)
  await user.save()

  const response = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'secret123'
    })
    .expect(200)

  token = response.body.token
})

// 4.8
test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(
    response.body.length,
    helper.initialBlogs.length
  )
})

// 4.9
test('blog identifier is id', async () => {
  const response = await api.get('/api/blogs')

  assert(response.body[0].id)
  assert.strictEqual(response.body[0]._id, undefined)
})

// 4.10
test('a blog can be added', async () => {
  const newBlog = {
    title: 'Learning JavaScript',
    author: 'David',
    url: 'https://example.com/javascript',
    likes: 4
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const blogs = await helper.blogsInDb()

  assert.strictEqual(
    blogs.length,
    helper.initialBlogs.length + 1
  )

  const titles = blogs.map(blog => blog.title)

  assert(titles.includes(newBlog.title))
})

// 4.11
test('likes default to zero', async () => {
  const newBlog = {
    title: 'Learning HTML',
    author: 'David',
    url: 'https://example.com/html'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

// 4.12
test('blog without title is rejected', async () => {
  const newBlog = {
    author: 'David',
    url: 'https://example.com/css',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog without url is rejected', async () => {
  const newBlog = {
    title: 'Learning CSS',
    author: 'David',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

// 4.13
test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(
    blogsAtEnd.length,
    blogsAtStart.length - 1
  )

  const ids = blogsAtEnd.map(blog => blog.id)

  assert(!ids.includes(blogToDelete.id))
})

// 4.14
test('blog likes can be updated', async () => {
  const blogs = await helper.blogsInDb()
  const blog = blogs[0]

  await api
    .put(`/api/blogs/${blog.id}`)
    .send({ likes: 10 })
    .expect(200)

  const updatedBlog = await Blog.findById(blog.id)

  assert.strictEqual(updatedBlog.likes, 10)
})

// 4.23
test('adding blog without token fails', async () => {
  const newBlog = {
    title: 'Learning Python',
    author: 'David',
    url: 'https://example.com/python',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogs = await helper.blogsInDb()

  assert.strictEqual(
    blogs.length,
    helper.initialBlogs.length
  )
})

after(async () => {
  await mongoose.connection.close()
})