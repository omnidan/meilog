/**
 * Logging and debugging via winston
 * 
 * Provides a small wrapper around the library to implement local logging as
 * well as structured logging. Also defines log levels and colors.
 * 
 * Log levels:
 * - crit: Critical events cause more severe problems or outages.
 * - error: Error events are likely to cause problems.
 * - warn: Warning events might cause problems.
 * - info: Routine information, such as ongoing status or performance.
 * - debug: Debug or trace information.
 */

const winston = require('winston')
const colors = require('colors')
const util = require('util')

const {
  LOG_LEVEL = 'info', // log everything >= this level
  LOG_DISABLE_JSON = false, // do not use structured logs in production
  NODE_ENV = 'development', // set to `production` for structured logs or logs without colors
} = process.env

const logLevels = {
  levels: {
    crit: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    crit: 'bgRed',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
  }
}

// template literal to format string values like in console.log
function d (template, ...expressions) {
  return template.reduce((result, part, i) =>
    result + util.inspect(expressions[i - 1], { breakLength: Infinity }) + part
  )
}

function createLogger (app, service) {
  const transports = NODE_ENV === 'production'
    ? [
      // use simpler logs in production
      new winston.transports.Console({
        format: LOG_DISABLE_JSON
          // if JSON is disabled, simply log timestamp, service, level and the message
          ? winston.format.combine(
              winston.format.timestamp(),
              winston.format.printf(({ service, level, message, timestamp }) =>
                `${timestamp} ${service + ':' + level} ${message}`
              ),
            )
          // otherwise, log structured logs in JSON format
          : winston.format.json({ replacer: function (key, value) {
              if (value && typeof value === 'object') {
                let replacement = {}
                for (let k in value) {
                  if (Object.hasOwnProperty.call(value, k)) {
                    if (k === 'level') {
                      replacement.severity = value[k]
                    } else if (k === 'service') {
                      replacement.component = value[k]
                    } else {
                      replacement[k] = value[k]
                    }
                  }
                }
                return replacement
              }
              return value
            }}),
      }),
    ] : [
      // in development we use fancy logs that are easier to read for developers
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'HH:mm:ss' }),
          winston.format.align(),
          winston.format.printf(({ service, level, message, timestamp }) =>
            `${timestamp} ${colors.bold(service + ':' + level)} ${message}`
          ),
          winston.format.colorize({ all: true }),
        ),
      }),
    ]

  // create a logger for a given app and service
  const logger = winston.createLogger({
    level: LOG_LEVEL,
    levels: logLevels.levels,
    defaultMeta: { app, service },
    transports,
  })
  winston.addColors(logLevels.colors)
  
  // implement a function to log error objects/exceptions
  logger.exception = (err, level = 'error') =>
    logger.log(level, `${err.stack || err}`, { error: err })

  logger.d = d

  return logger
}

const { info, debug } = createLogger('logger', 'log')
info(`environment: ${NODE_ENV}`)
debug(`log level: ${LOG_LEVEL}`)

module.exports = createLogger
