import { useParams, useNavigate } from 'react-router-dom'

const BlogView = ({ blogs, user, updateBlog, deleteBlog }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const blog = blogs.find(b => b.id === id)

  if (!blog) return <div>Blog not found</div>

  const handleLike = () => {
    updateBlog(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user
    })
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      const success = await deleteBlog(blog.id)
      if (success) navigate('/')
    }
  }

  const isOwner = user && blog.user && (
    blog.user.username === user.username || blog.user === user.username
  )

  return (
    <div className="blog-view">
      <h2>{blog.title}</h2>
      <div className="blog-view-author">by {blog.author}</div>
      <a className="blog-view-url" href={blog.url} target="_blank" rel="noreferrer">
        {blog.url}
      </a>
      <div className="blog-view-likes">
        {blog.likes}
        <span>likes</span>
        {user && <button onClick={handleLike}>♥ like</button>}
      </div>
      {isOwner && (
        <button className="btn-delete" onClick={handleDelete}>
          delete blog
        </button>
      )}
    </div>
  )
}

export default BlogView