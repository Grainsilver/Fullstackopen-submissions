import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: 20 }}>Create new blog</h2>
      <div className="form-group">
        <label>Title</label>
        <input
          data-testid="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Blog title"
        />
      </div>
      <div className="form-group">
        <label>Author</label>
        <input
          data-testid="author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Author name"
        />
      </div>
      <div className="form-group">
        <label>URL</label>
        <input
          data-testid="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>
      <button className="btn-primary" type="submit">Create</button>
    </form>
  )
}

export default BlogForm