const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, response) => {
    response.id = response._id.toString()

    delete response._id
    delete response.__v
  },
})

module.exports = mongoose.model('Blog', blogSchema)
