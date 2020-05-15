const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  //  title: String,
  // url: String,
  title: {
    type: String,
    // required: true,
  },
  url: {
    type: String,
    // required: true,
  },
  author: String,
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

blogSchema.set('toJSON', {
  transform: (document, blogObject) => {
    // response.likes = response.likes ? response.likes : 0
    blogObject.id = blogObject._id.toString()

    delete blogObject._id
    delete blogObject.__v
  },
})

module.exports = mongoose.model('Blog', blogSchema)
