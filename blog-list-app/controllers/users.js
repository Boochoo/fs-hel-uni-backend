const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  })

  response.json(users.map((u) => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const { password, username, name, blogs } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
    blogs: blogs,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter
