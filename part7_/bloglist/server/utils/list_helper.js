// 4.3
const dummy = blogs => {
  return 1
}

// 4.4
const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

// 4.5
const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  )
}

// 4.6
const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const authors = {}

  blogs.forEach(blog => {
    authors[blog.author] = (authors[blog.author] || 0) + 1
  })

  const author = Object.keys(authors).reduce((a, b) =>
    authors[a] >= authors[b] ? a : b
  )

  return {
    author: author,
    blogs: authors[author]
  }
}

// 4.7
const mostLikes = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const authors = {}

  blogs.forEach(blog => {
    authors[blog.author] = (authors[blog.author] || 0) + blog.likes
  })

  const author = Object.keys(authors).reduce((a, b) =>
    authors[a] >= authors[b] ? a : b
  )

  return {
    author: author,
    likes: authors[author]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}