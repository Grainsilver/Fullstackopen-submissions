const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (req, res) => {
    
  const users = await User
    .find({}).populate('blogs', {title: 1, author: 1, url: 1, like: 1})
  res.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!username) return res.status(400).json({ error: 'username is required' })
  if (!password || password.length < 3) return res.status(400).json({ error: 'password must be at least 3 characters' })

  const existingUser = await User.findOne({ username })
  if (existingUser) return res.status(400).json({ error: 'username must be unique' })

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({ username, name, passwordHash })
  const savedUser = await user.save()

  res.status(201).json(savedUser.toJSON())
})

module.exports = usersRouter