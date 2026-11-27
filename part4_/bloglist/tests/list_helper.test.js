const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
  {
    title: 'Learning React',
    author: 'John Smith',
    url: 'https://example.com/react',
    likes: 5
  },
  {
    title: 'Learning Node.js',
    author: 'Anna',
    url: 'https://example.com/node',
    likes: 10
  },
  {
    title: 'JavaScript Basics',
    author: 'John Smith',
    url: 'https://example.com/javascript',
    likes: 3
  },
  {
    title: 'Learning MongoDB',
    author: 'John Smith',
    url: 'https://example.com/mongodb',
    likes: 4
  },
  {
    title: 'Express Basics',
    author: 'Anna',
    url: 'https://example.com/express',
    likes: 8
  }
]

// 4.3
test('dummy returns one', () => {
  assert.strictEqual(listHelper.dummy([]), 1)
})

// 4.4
describe('total likes', () => {
  test('empty list', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('one blog', () => {
    assert.strictEqual(listHelper.totalLikes([blogs[0]]), 5)
  })

  test('multiple blogs', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 30)
  })
})

// 4.5
describe('favorite blog', () => {
  test('empty list', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('one blog', () => {
    assert.deepStrictEqual(
      listHelper.favoriteBlog([blogs[0]]),
      blogs[0]
    )
  })

  test('multiple blogs', () => {
    assert.deepStrictEqual(
      listHelper.favoriteBlog(blogs),
      blogs[1]
    )
  })
})

// 4.6
describe('most blogs', () => {
  test('empty list', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('one blog', () => {
    assert.deepStrictEqual(
      listHelper.mostBlogs([blogs[0]]),
      { author: 'John Smith', blogs: 1 }
    )
  })

  test('multiple blogs', () => {
    assert.deepStrictEqual(
      listHelper.mostBlogs(blogs),
      { author: 'John Smith', blogs: 3 }
    )
  })
})

// 4.7
describe('most likes', () => {
  test('empty list', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('one blog', () => {
    assert.deepStrictEqual(
      listHelper.mostLikes([blogs[0]]),
      { author: 'John Smith', likes: 5 }
    )
  })

  test('multiple blogs', () => {
    assert.deepStrictEqual(
      listHelper.mostLikes(blogs),
      { author: 'Anna', likes: 18 }
    )
  })
})