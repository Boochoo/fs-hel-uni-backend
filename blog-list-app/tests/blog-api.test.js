const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const { blogsMockData, blogsInDB, nonExistingId } = require('./test-helper')

const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogs = blogsMockData.map((blog) => new Blog(blog))
  const blogsArray = blogs.map((blog) => blog.save())

  await Promise.all(blogsArray)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const { body } = await api.get('/api/blogs')

    expect(body).toHaveLength(blogsMockData.length)
  })

  test('there are 6 blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(6)
  })

  test('blog has id instead of the default _id', async () => {
    const res = await api.get('/api/blogs')
    const result = res.body.find((r) => r.id)

    expect(result).toBeDefined()
  })
})

describe('view a specific blog', () => {
  test('succeeds with a specific valid id', async () => {
    const initialBlogs = await blogsInDB()
    const blogToView = initialBlogs[0]

    const { body } = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-type', /application\/json/)

    expect(body).toEqual(blogToView)
  })

  test('fails with status 404 if blog does not exist', async () => {
    const validNonExistingId = await nonExistingId()

    await api.get(`/api/blogs/${validNonExistingId}`).expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api.get(`/api/blogs/${invalidId}`).expect(400)
  })
})

describe('addition of a new blog', () => {
  test('a valid blog list can be added', async () => {
    const newBlog = {
      title: 'Bruh',
      author: 'Bruhvoaaa',
      url: 'bruh.fi',
      likes: 4,
    }

    await api
      .post('/api/blogs')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkVybWkiLCJpZCI6IjVlYmQzODhkMDBkZTVjODE0OTlhMzY2ZiIsImlhdCI6MTU4OTUzNDAzOH0.A7XzUeRCuVpkPPceVT0B0aVNtKSRJVkiY0bhk0Ez038'
      )
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await blogsInDB()

    expect(response).toHaveLength(blogsMockData.length + 1)
  })

  test('blog with no likes property will have a value 0', async () => {
    const newBlog = {
      title: 'Bruh',
      author: 'Bruhvoaaa',
      url: 'bruh.fi',
    }

    await api.post('/api/blogs').send(newBlog).expect(200)

    const blogs = await blogsInDB()

    const blogWithNoLikes = blogs.find(
      (blog) => blog.title === 'React is her thang!'
    )

    expect(blogWithNoLikes).toBeDefined()
    expect(blogWithNoLikes.likes).toBe(0)
  })

  test('fails if blog has no title and url', async () => {
    const newBlog = {
      author: 'Bruhvoaaa',
      likes: 4,
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogs = await blogsInDB()

    expect(blogs).toHaveLength(blogsMockData.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const inititalBlogs = await blogsInDB()
    const blogToDelete = inititalBlogs[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAfterDeletion = await blogsInDB()
    expect(blogsAfterDeletion).toHaveLength(inititalBlogs.length - 1)

    const blogs = blogsAfterDeletion.map((blog) => blog.title)
    expect(blogs).not.toContain(blogToDelete.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
