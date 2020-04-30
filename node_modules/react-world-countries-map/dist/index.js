
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react-world-countries-map.cjs.production.min.js')
} else {
  module.exports = require('./react-world-countries-map.cjs.development.js')
}
