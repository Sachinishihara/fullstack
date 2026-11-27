import { render, screen } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Learning React',
  author: 'John Smith',
  url: 'https://example.com/react',
  likes: 5,
  user: {
    username: 'student',
    name: 'Student'
  }
}

// 5.27
test('guest sees blog information without buttons', () => {
  render(<Blog blog={blog} user={null} />)

  expect(screen.getByText(blog.title)).toBeVisible()
  expect(screen.getByText(blog.author)).toBeVisible()
  expect(screen.getByText(blog.url)).toBeVisible()
  expect(screen.getByText('likes 5')).toBeVisible()

  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

test('other user sees only like button', () => {
  const user = {
    username: 'otheruser',
    name: 'Other User'
  }

  render(<Blog blog={blog} user={user} />)

  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
  expect(screen.queryByRole('button', { name: 'remove' }))
    .not.toBeInTheDocument()
})

test('creator sees like and remove buttons', () => {
  const user = {
    username: 'student',
    name: 'Student'
  }

  render(<Blog blog={blog} user={user} />)

  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
  expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
})