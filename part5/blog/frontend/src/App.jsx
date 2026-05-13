import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))
  }, [])

  useEffect(() => {
    const savedUser = window.localStorage.getItem('loggedBlogappUser')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      blogService.setToken(parsedUser.token)
    }
  }, [])

  const showNotification = (text, type = 'success') => {
    setNotification({ text, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loginUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loginUser))
      blogService.setToken(loginUser.token)
      setUser(loginUser)
      setUsername('')
      setPassword('')
      showNotification(`Welcome ${loginUser.name}`)
      return true
    } catch {
      showNotification('Wrong credentials', 'error')
      return false
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      showNotification(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      return returnedBlog
    } catch {
      showNotification('Error creating blog', 'error')
      return null
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const returned = await blogService.update(id, blogObject)
      setBlogs(blogs.map(b => b.id === id ? { ...b, likes: returned.likes } : b))
    } catch {
      showNotification('Error updating likes', 'error')
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      showNotification('Blog deleted successfully')
      return true
    } catch {
      showNotification('Error deleting blog', 'error')
      return false
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const LoginPage = () => {
    const navigate = useNavigate()

    const onLogin = async (e) => {
      const success = await handleLogin(e)
      if (success) navigate('/')
    }

    if (user) return <Navigate to="/" />

    return (
      <div className="app-container">
        <div className="form-card">
          <h2>Sign in</h2>
          <form onSubmit={onLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                data-testid="username"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                data-testid="password"
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button className="btn-primary" type="submit">Login</button>
          </form>
        </div>
      </div>
    )
  }

  const BlogsPage = () => {
    const navigate = useNavigate()

    const handleAddBlog = async (blogObject) => {
      const result = await addBlog(blogObject)
      if (result) navigate('/')
    }

    return (
      <div className="app-container">
        <h2>All blogs</h2>
        <Togglable buttonLabel="+ New blog" ref={blogFormRef}>
          <BlogForm createBlog={handleAddBlog} />
        </Togglable>
        {sortedBlogs.map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
          />
        ))}
      </div>
    )
  }

  return (
    <Router>
      <div>
        <nav>
          <span className="nav-brand">Bloglist</span>
          <Link to="/">blogs</Link>
          {!user && <Link to="/login">login</Link>}
          <span className="nav-spacer" />
          {user && (
            <span className="nav-user">
              {user.name}
              <button onClick={handleLogout}>logout</button>
            </span>
          )}
        </nav>

        <div className="app-container" style={{ padding: '24px 24px 0' }}>
          <Notification message={notification} />
        </div>

        <Routes>
          <Route path="/" element={
            user ? <BlogsPage /> : <Navigate to="/login" />
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/blogs/:id" element={
            <div className="app-container">
              <BlogView
                blogs={blogs}
                user={user}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
              />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App