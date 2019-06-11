import { responseCreator } from './responseCreator'

export class Helper {
  error(msg) {
    throw { message: msg }
  }

  isNull(val) {
    return val === null || val === undefined
  }

  notNull(val) {
    return val !== null && val !== undefined
  }

  async response({ data, location, func, next }) {
    location = data.location || location
    func = data.func || func
    next(responseCreator({ data }, location, func))
  }

  async exception({ message, location, func, next }) {
    next(responseCreator({ message }, location, func, 500))
  }
}

export const helper = new Helper()
export default helper