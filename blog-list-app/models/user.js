const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    minlength: 3,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, response) => {
    response.id = response._id.toString()

    delete response._id
    delete response.__v
    delete response.passwordHash
  },
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
