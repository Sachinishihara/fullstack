import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
  blogs: [],

  initialize: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },

  addBlog: async (blog) => {
    const created = await blogService.create(blog)
    set((state) => ({
      blogs: state.blogs.concat(created)
    }))
    return created
  },

  addLike: async (blog) => {
    const updated = await blogService.update(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    })

    set((state) => ({
      blogs: state.blogs.map((b) => (b.id === blog.id ? updated : b))
    }))
  },

  removeBlog: async (id) => {
    await blogService.remove(id)
    set((state) => ({
      blogs: state.blogs.filter((b) => b.id !== id)
    }))
  },

  addComment: async (id, comment) => {
    const updated = await blogService.addComment(id, comment)

    set((state) => ({
      blogs: state.blogs.map((b) => (b.id === id ? updated : b))
    }))
  }
}))

export default useBlogStore
