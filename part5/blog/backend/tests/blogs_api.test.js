const assert = require('node:assert')
const { test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)
let token
let userId

beforeEach(async () => {
  // Clear existing users and blogs
  await User.deleteMany({})
  await Blog.deleteMany({})

  const uniqueUsername = `root_${Date.now()}_${Math.random()}`

  const newUser = {
    username: uniqueUsername,
    name: 'Superuser',
    password: 'secret'
  }

  const userCreationResponse = await api.post('/api/users').send(newUser)
  console.log(userCreationResponse.body)
  assert.strictEqual(userCreationResponse.status, 201, 'User creation failed')

  // Login to get token
  const loginResponse = await api.post('/api/login').send({
    username: uniqueUsername,
    password: 'secret'
  })
  assert.ok(loginResponse.body.token, 'Login failed, token missing')
  token = loginResponse.body.token

  // Get user ID from DB
  const user = await User.findOne({ username: uniqueUsername })
  assert.ok(user, 'User not found in DB')
  userId = user._id

  // Insert initial blogs and attach user
  const blogsWithUser = helper.initialBlogs.map(blog => ({
    ...blog,
    user: userId
  }))
  await Blog.insertMany(blogsWithUser)

  // Confirm insertion
  const count = await Blog.countDocuments()
  assert.strictEqual(count, helper.initialBlogs.length, 'Initial blogs not inserted correctly')
})

test('blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.status, 200)
  assert.match(response.headers['content-type'], /application\/json/)
})

test('all blogs are returned', async () => {
  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

test('blogs have id property', async () => {
  const blogs = await helper.blogsInDb()
  blogs.forEach(blog => assert.ok(blog.id))
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Test Blog',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 5
  }

  const postResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(postResponse.status, 201)
  assert.match(postResponse.headers['content-type'], /application\/json/)

  const blogs = await helper.blogsInDb()
  const titles = blogs.map(b => b.title)
  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
  assert.ok(titles.includes('New Test Blog'))
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without Likes',
    author: 'Test Author',
    url: 'https://testblog.com'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.status, 201)

  const blogs = await helper.blogsInDb()
  const addedBlog = blogs.find(b => b.title === 'Blog without Likes')
  assert.strictEqual(addedBlog.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = { author: 'No Title', url: 'https://notitle.com', likes: 5 }
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  assert.strictEqual(response.status, 400)

  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = { title: 'No URL', author: 'Test Author', likes: 3 }
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
  assert.strictEqual(response.status, 400)

  const blogs = await helper.blogsInDb()
  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
    

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(
    blogsAtEnd.length,
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(b => b.title)

  assert.ok(!titles.includes(blogToDelete.title))
})

after(async () => {
  await mongoose.connection.close()
})