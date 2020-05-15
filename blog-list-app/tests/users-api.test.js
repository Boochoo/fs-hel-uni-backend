const bcrypt = require('bcrypt')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const User = require('../models/user')
const { usersInDB } = require('./test-helper')

const api = supertest(app)

describe('where there is initially one use in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  it('creation succeeds with a fresh username', async () => {
    const initialUser = await usersInDB()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const dbAfterAddition = await usersInDB()

    expect(dbAfterAddition).toHaveLength(initialUser.length + 1)

    const usernames = dbAfterAddition.map((u) => u.username)

    expect(usernames).toContain(newUser.username)
  })

  it('creation fails if username is not unique', async () => {
    const initialUser = await usersInDB()

    const newUser = {
      username: 'root',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const dbAfterAddition = await usersInDB()

    expect(dbAfterAddition).toHaveLength(initialUser.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
