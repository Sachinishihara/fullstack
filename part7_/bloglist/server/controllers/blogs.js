const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1
  })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!body.title || !body.url) {
    return response.status(400).end()
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  await savedBlog.populate('user', {
    username: 1,
    name: 1
  })

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (!blog) {
    return response.status(404).end()
  }

  if (!blog.user || blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({
      error: 'only the creator can delete this blog'
    })
  }

  await Blog.findByIdAndDelete(request.params.id)

  user.blogs = user.blogs.filter(
    id => id.toString() !== blog._id.toString()
  )

  await user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    },
    { returnDocument: 'after', runValidators: true }
  ).populate('user', {
    username: 1,
    name: 1
  })

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body

  if (typeof comment !== 'string' || !comment.trim()) {
    return response.status(400).json({ error: 'comment is required' })
  }

  const blog = await Blog.findByIdAndUpdate(
    request.params.id,
    { $push: { comments: comment.trim() } },
    { returnDocument: 'after' }
  ).populate('user', { username: 1, name: 1 })

  if (!blog) {
    return response.status(404).end()
  }

  response.status(201).json(blog)
})

module.exports = blogsRouter
