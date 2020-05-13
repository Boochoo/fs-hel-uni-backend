const dummy = (blogs) => {
  return blogs ? 1 : null
}

const totalLikes = (blogs) => {
  const reducer = (total, currentLikes) => total + currentLikes.likes

  return blogs.reduce(reducer, 0)
}

const getTopBlog = (blogs, key) => {
  const getMax = Math.max(...blogs.map((m) => m[key]))

  return blogs.find((blog) => blog[key] === getMax)
}

const favoriteBlog = (blogs) => {
  const topLiked = getTopBlog(blogs, 'likes')
  const { title, author, likes } = topLiked

  return {
    title,
    author,
    likes,
  }
}

const mostBlogs = (blogs) => {
  const allBlogsByAuthor = blogs.reduce(
    (acc, { author }) => ({
      ...acc,
      [author]: (acc[author] || 0) + 1,
    }),
    []
  )

  const amountOfBlogsByAuthors = Object.entries(allBlogsByAuthor).map(
    (authors) => {
      const [author, blogs] = authors

      return {
        author,
        blogs,
      }
    }
  )

  return getTopBlog(amountOfBlogsByAuthors, 'blogs')
}

const mostLikes = (blogs) => {
  const getAuthorsBylikes = blogs.reduce((obj, { author, likes }) => {
    if (!obj[author]) {
      obj[author] = {
        author,
        likes,
      }
    } else {
      obj[author].likes += likes
    }

    return obj
  }, [])

  return getTopBlog(Object.values(getAuthorsBylikes), 'likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
