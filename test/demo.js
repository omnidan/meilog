const createLogger = require('../src/index')

const { d, debug, info, warn, error, crit, exception } = createLogger('logger', 'demo')

debug('Debug or trace information.')
info('Routine information, such as ongoing status or performance.')
warn('Warning events might cause problems.')
error('Error events are likely to cause problems.')
exception(new Error('something went wrong!'))
crit('Critical events cause more severe problems or outages.')
exception(new Error('fatal error'), 'crit')

const obj = { hello: 'world', works: true }
const str = 'it works'
const number = 100
debug(d`testing the template literal: ${obj} - ${str} ${number}`)
