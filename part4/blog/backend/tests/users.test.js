const assert = require('node:assert')
const { test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token

beforeEach(async () => {
  await mongoose.connection.dropDatabase()

  // Now create the test user
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1e9)
  const username = `user_${timestamp}_${random}`

  const newUser = { username, name: 'Superuser', password: 'sekret' }
  
  const createResponse = await api.post('/api/users').send(newUser)
  assert.strictEqual(createResponse.status, 201)

  const loginResponse = await api.post('/api/login').send({ username, password: 'sekret' })
  token = loginResponse.body.token
})

test('users are returned as json', async () => {
  const response = await api.get('/api/users')
  assert.strictEqual(response.status, 200)
  assert.match(response.headers['content-type'], /application\/json/)
})

test('all users are returned', async () => {
  const users = await helper.usersInDb()
  assert.strictEqual(users.length, 1)
})

test('a valid user can be added', async () => {
  // Even safer unique username for the test
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1e9) + 1   // +1 to avoid any edge case
  const uniqueUsername = `user_${timestamp}_${random}_test`

  const newUser = {
    username: uniqueUsername,
    name: 'Lilian',
    password: 'secret123'
  }

  const response = await api.post('/api/users').send(newUser)

  assert.strictEqual(response.status, 201)
  assert.match(response.headers['content-type'], /application\/json/)

  const users = await helper.usersInDb()
  const usernames = users.map(u => u.username)

  assert.strictEqual(users.length, 2)
  assert.ok(usernames.includes(uniqueUsername))
})

test('creation fails without username', async () => {
  await api.post('/api/users').send({ name: 'NoUsername', password: 'secret123' }).expect(400)
  const users = await helper.usersInDb()
  assert.strictEqual(users.length, 1)
})

test('creation fails if password is too short', async () => {
  await api.post('/api/users').send({ username: 'shortpass', name: 'Short', password: '12' }).expect(400)
  const users = await helper.usersInDb()
  assert.strictEqual(users.length, 1)
})

after(async () => {
  await mongoose.connection.close()
})