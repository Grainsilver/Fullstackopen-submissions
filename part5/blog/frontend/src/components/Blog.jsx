import { useState } from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const handleLikeClick = () => {
    if (updateBlog) {
      updateBlog(blog.id, {
        user: blog.user?.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      })
    }
  }

  const handleDelete = () => {
    if (deleteBlog && window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div className="blog">
      <div className="blog-header">
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        <span className="blog-author">{blog.author}</span>
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className="blog-details">
          <div className="blog-url">{blog.url}</div>
          <div className="blog-likes">
            ♥ {blog.likes}
            {user && <button onClick={handleLikeClick}>like</button>}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            added by {blog.user?.name}
          </div>
          {user?.username === blog.user?.username && (
            <button className="btn-remove" onClick={handleDelete}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog