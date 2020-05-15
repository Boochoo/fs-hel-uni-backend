require('dotenv').config()

const { NODE_ENV, TEST_MONGODB_URI, MONGODB_URL, SECRET } = process.env

let PORT = process.env.PORT || 3003
let MONGODB_URI = NODE_ENV === 'test' ? TEST_MONGODB_URI : MONGODB_URL

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
}
