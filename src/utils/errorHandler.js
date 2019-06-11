class ErrorHandler {
  report(errCode, message, location, func) {
    throw { errCode, message, location, func }
  }

  error({ errCode, message, location, func, code = 500}) {
    throw { errCode, message, location, func, code }
  }
}

export const errorHandler = new ErrorHandler()