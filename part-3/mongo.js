const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const { MONGODB_URI } = require('./config')

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    required: true,
    unique: true,
  },
})

contactSchema.plugin(uniqueValidator)

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv[2] && process.argv[3]) {
  const contact = new Contact({
    name: process.argv[2],
    number: process.argv[3],
  })

  contact.save().then((response) => {
    console.log(`added ${response.name} ${response.number} to phonebook`)

    mongoose.connection.close()
  })
}

Contact.find({}).then((result) => {
  console.log('Phonebook:')
  result.forEach((contact) => {
    console.log(contact.name, contact.number)
  })

  mongoose.connection.close()
})
