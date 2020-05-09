const winston = require('winston')

/**
 * Init a Winston logger
 * 
 * @param {string} loggerName The name of the logger ex. "updateUserLogger"
 */
const createLogger = loggerName => winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { name: loggerName },
  transports: [ new winston.transports.Console() ]
})

module.exports = { createLogger }
