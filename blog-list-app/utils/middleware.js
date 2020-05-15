const jwt = require('jsonwebtoken')
const logger = require('./logger')

const { SECRET } = require('./config')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError' /* && error.kind === 'ObjectId' */) {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    logger.info('JsonWebTokenError', error)
    return response.status(401).json({
      error: 'invalid token',
    })
  }

  logger.error(error.message)

  next(error)
}

const tokenExtractor = (request, _, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = jwt.verify(authorization.substring(7), SECRET)

    next()
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
}
