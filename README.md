# :page_with_curl: meilog

_beautiful logging library with support for structured logs (for cloud services) and local logging with colors_

![meilog `yarn demo` screenshot](https://github.com/omnidan/meilog/blob/demo-image/meilog-demo.png?raw=true)


## Motivation

This library aims to provide a simple logging solution based on [`winston`](https://github.com/winstonjs/winston).

**Who is this for?** If you do not want to spend a lot of time setting up your
logging library, and want it to work with cloud platforms while still having
your looks look neat in your local development environment.

**How does it work?** The library exports a `createLogger` function, which can
be used to create a logger for a given application. Then, each part of the
application (called `service`) can have its own logging namespace. We also
provide convenient logging functions for `debug`, `info`, `warn`, `error` and
`crit` logs, which are all compatible with the `winston` logging functions.
Additionally, we provide an `exception` function to easily log exceptions.

**Structured logs? Cloud Services?** When the library is used in a production
environment, it will default to printing the logs in structured JSON format,
so that cloud platforms can parse the logs, for example:

```
{"message":"hello world!","severity":"info","app":"logger","component":"log"}
```


## Installation

First install the library with `npm`:

```
npm install --save meilog
```

Or with `yarn`:

```
yarn add meilog
```


## Usage

This library can be used with both ES6 imports or the default node.js import
system using `require`.

### ES6 imports

It is recommended that you create a new `log.js` file in your project:

```js
import createLogger from 'meilog'

const makeLogger = service => createLogger('APPNAME', service)

export default makeLogger
```

Then, use the logger as follows:

```js
import makeLogger from './log'
const { debug, info, warn, error, crit, exception } = makeLogger('SERVICENAME')

debug('Debug or trace information.')
info('Routine information, such as ongoing status or performance.')
warn('Warning events might cause problems.')
error('Error events are likely to cause problems.')
exception(new Error('something went wrong!'))
crit('Critical events cause more severe problems or outages.')
exception(new Error('fatal error'), 'crit')
```

### node.js imports

It is recommended that you create a new `log.js` file in your project:

```js
const createLogger = require('meilog')

module.exports = service => createLogger('APPNAME', service)
```

Then, use the logger as follows:

```js
const { debug, info, warn, error, crit, exception } = require('./log')('SERVICENAME')

debug('Debug or trace information.')
info('Routine information, such as ongoing status or performance.')
warn('Warning events might cause problems.')
error('Error events are likely to cause problems.')
exception(new Error('something went wrong!'))
crit('Critical events cause more severe problems or outages.')
exception(new Error('fatal error'), 'crit')
```


## Log levels

We use a subset of the official `syslog` log levels:

 - **crit:** Critical events cause more severe problems or outages.
 - **error:** Error events are likely to cause problems.
 - **warn:** Warning events might cause problems.
 - **info:** Routine information, such as ongoing status or performance.
 - **debug:** Debug or trace information.


## Configuration

The logging library is configured using the following environment variables:

 - **`LOG_LEVEL`** (default: `info`) - everything higher than this level is logged
 - **`LOG_DISABLE_JSON`** (default: `false`) - disable structured JSON logs in production
 - **`NODE_ENV`** (default: `development`) - set to `production` to enable structured JSON logs or simpler logs (without colors)
