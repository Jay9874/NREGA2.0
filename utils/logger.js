const winston = require('winston');
const { createLogger, transports } = winston;


// Define log level colors
const logColors = {
  error: 'red',
  crit: 'magenta',
  warn: 'yellow',
  info: 'blue',
  data: 'green',
  trace: 'yellow',
  fatal: 'red'
}
winston.addColors(logColors)

// Define custom log levels
const customLevels = {
  error: 0,
  crit: 1,
  warn: 2,
  info: 3,
  data: 4,
  trace: 5,
  fatal: 6
}

// Create logger instance
const logger = createLogger({
  level: 'trace', // Set the lowest level to capture everything
  levels: customLevels,
  format: winston.format.combine(
    winston.format.errors({ stack: true }), // Automatically log stack traces
    winston.format.timestamp({ format: 'DD-MM-YYYY hh:mm:ss A' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      let match = null
      let fileInfo = ''
      if (stack) {
        match = stack.match(/at .* \((?:file:\/\/)?(.*?):(\d+):(\d+)\)/)
        if (match) {
          const fullPath = match[1] // Absolute file path
          const line = match[2] // Line number
          const column = match[3] // Column number
          // Extract the last two directories + file name
          const parts = fullPath.split('/')
          const relativePath = parts.slice(-2).join('/') // Get last two segments
          fileInfo = `${relativePath}:${line},${column}`
        }
      }
      return stack
        ? `${timestamp} - [${
            match ? fileInfo : 'No file info'
          }] -${level}: ${message}` // Log stack trace for errors
        : `${timestamp} - ${level}: ${message}`
    })
  ),
  transports: [
    new transports.Console({
      json: false,
      timestamp: true,
      depth: true,
      colorize: true
    }),
    new transports.File({
      filename: 'bot.log',
      format: winston.format.uncolorize() // Remove colors for file logs
    })
  ]
})

// Ensure errors log stack trace
const origLog = logger.log
logger.log = function (level, msg, ...args) {
  if (msg instanceof Error) {
    origLog.call(logger, level, msg.stack, ...args)
  } else {
    console.log('in the else part')
    origLog.call(logger, level, msg, ...args)
  }
}

// Export logger (CommonJS style)
module.exports = { logger };


/* LOGGER EXAMPLES
  const log = require('./log.js');
  log.trace('Testing');
  log.debug('Testing');
  log.info('Testing');
  log.warn('Testing');
  log.crit('Testing');
  log.fatal('Testing');
 */
