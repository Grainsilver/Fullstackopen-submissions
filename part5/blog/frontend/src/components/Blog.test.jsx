import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Blog from './Blog'

const blog = {
  id: '123',
  title: 'Test blog',
  author: 'John',
  url: 'test.com',
  likes: 5,
  user: {
    username: 'john123',
    id: 'u1',
    name: 'John'
  }
}

const user = {
  username: 'john123'
}

describe('Blog component', () => {

  // 5.13
  test('renders title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} user={user} />)

    const element = screen.getByText('Test blog John')
    expect(element).toBeDefined()

    const details = screen.queryByText('test.com')
    expect(details).toBeNull()

    const likes = screen.queryByText(/likes/)
    expect(likes).toBeNull()
  })

  // 5.14
  test('shows url and likes when view button is clicked', async () => {
    render(<Blog blog={blog} user={user} />)

    const userEventInstance = userEvent.setup()

    await userEventInstance.click(screen.getByText('view'))

    expect(screen.getByText('test.com')).toBeDefined()
    expect(screen.getByText(/likes 5/)).toBeDefined()
  })

  // 5.15
  test('like button calls event handler twice when clicked twice', async () => {
    const mockUpdateBlog = vi.fn()

    render(
      <Blog
        blog={blog}
        user={user}
        updateBlog={mockUpdateBlog}
      />
    )

    const userEventInstance = userEvent.setup()

    await userEventInstance.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')

    await userEventInstance.click(likeButton)
    await userEventInstance.click(likeButton)

    expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
  })
})