const {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
} = require('../utils/list-helper')
const { blogsMockData } = require('./test-helper')

describe('List helper', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const listWithBlogs = []

    expect(totalLikes(listWithBlogs)).toBe(0)
  })
  test('when list has only one blog equals likes the likes of that', () => {
    const listWithOneBlog = blogsMockData.slice(0, 1)
    const result = totalLikes(listWithOneBlog)

    expect(result).toBe(7)
  })

  test('of a bigger list is calculated right', () => {
    const result = totalLikes(blogsMockData)

    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('must be equal to', () => {
    const topLiked = favoriteBlog(blogsMockData)
    const mockTopLiked = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }

    expect(topLiked).toEqual(mockTopLiked)
  })

  test('most blogs', () => {
    const mostBlogged = mostBlogs(blogsMockData)
    const mostBloggedMock = { author: 'Robert C. Martin', blogs: 3 }

    expect(mostBlogged).toEqual(mostBloggedMock)
  })

  test('most likes', () => {
    const mostLiked = mostLikes(blogsMockData)
    const mostLikesMock = { author: 'Edsger W. Dijkstra', likes: 17 }

    expect(mostLiked).toEqual(mostLikesMock)
  })
})
