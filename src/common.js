const { URL } = require('url')

const filterObj = require('filter-obj')

function addSuccess(result, object) {
  return { ...result, success: [...result.success, object] }
}

function addError(result, object) {
  return { ...result, errors: [...result.errors, object] }
}

function isInvalidSource(redirect) {
  return redirect.path.match(/^\/\.netlify/)
}

function isProxy(redirect) {
  return Boolean(redirect.proxy || (/^https?:\/\//.test(redirect.to) && redirect.status === 200))
}

const FULL_URL_MATCHER = /^(https?):\/\/(.+)$/

function parseFrom(from) {
  if (from === undefined) {
    return {}
  }

  if (!FULL_URL_MATCHER.test(from)) {
    return { path: from }
  }

  try {
    const { host, protocol, pathname: path } = new URL(from)
    const scheme = protocol.slice(0, -1)
    return { scheme, host, path }
  } catch (error) {
    return {}
  }
}

function isDefined(key, value) {
  return value !== undefined
}

function removeUndefinedValues(object) {
  return filterObj(object, isDefined)
}

module.exports = {
  addSuccess,
  addError,
  isInvalidSource,
  isProxy,
  FULL_URL_MATCHER,
  parseFrom,
  removeUndefinedValues,
}
