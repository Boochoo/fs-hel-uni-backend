const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contacts')

const app = express()

morgan.token('body', function (req) {
  const body = JSON.stringify(req.body)
  return body !== '{}' ? body : ''
})

const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
)

// middlewares
app.use(express.static('build'))
app.use(express.json())
app.use(logger)
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (req, res) => {
  Contact.find({}).then((contacts) => {
    const allContacts = contacts.map((contact) => contact.toJSON())
    res.json(allContacts)
  })
})

app.post('/api/persons', (req, res, next) => {
  const { body } = req
  const { name, number } = body
  const flag = (str) =>
    res.status(400).json({
      error: `${str}`,
    })

  const isORHAd = Contact.find({}).then((contatcs) => {
    contatcs.find((c) => c.name !== name)
  })

  console.log(isORHAd)

  const newContact = new Contact({
    name,
    number,
  })

  if (!name) {
    return flag('missing name')
  } else if (!number) {
    return flag('missing number')
  } /* else if (nameExists(persons)) {
    return flag('duplicate name');
  } */

  newContact
    .save()
    .then((savedContact) => savedContact.toJSON())
    .then((formattedContact) => res.json(formattedContact))
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        res.json(contact.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Contact.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

/* console.log(Contact.find((p) => p.name === 'Davido')); */

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const { name, number } = body

  const contact = {
    name,
    number,
  }

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then((updatedContact) => updatedContact.toJSON())
    .then((fotmattedContact) => res.json(fotmattedContact))
    .catch((error) => next(error))
})

/* const infoContent = `
	<p>Phonebook has info of ${persons.length} people</p>
	<p>${new Date()}</p>
`;

app.get('/info', (req, res) => {
  res.send(infoContent);
});
 */
const unkownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unkown endpoint' })
}

app.use(unkownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
