const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...error) => {
  console.log(...error)
}

module.exports = {
  info,
  error,
}
