import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

// 5.16
test('form submits correct blog details', async () => {
  const createBlog = vi.fn().mockResolvedValue(true)
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByLabelText('title:'), 'Learning React')

  await user.type(screen.getByLabelText('author:'), 'John Smith')

  await user.type(screen.getByLabelText('url:'), 'https://example.com/react')

  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Learning React',
    author: 'John Smith',
    url: 'https://example.com/react'
  })
})
