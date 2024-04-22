abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

class NotAuthorizedError extends CustomError {
  statusCode = 403; // HTTP status code for Forbidden

  constructor(message = 'Not Authorized') {
    super(message);
    this.name = 'NotAuthorizedError';
  }
}

class BadRequestError extends CustomError {
  statusCode = 400; // HTTP status code for Bad Request

  constructor(message = 'Bad Request') {
    super(message);
    this.name = 'BadRequestError';
  }
}

// Example of adding a new error type
class NotFoundError extends CustomError {
  statusCode = 404; // HTTP status code for Not Found

  constructor(message = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

class InternalServerError extends CustomError {
  statusCode = 500; // HTTP status code for Internal Server Error

  constructor(message = 'Internal Server Error') {
    super(message);
    this.name = 'InternalServerError';
  }
}

export {
  BadRequestError,
  CustomError,
  InternalServerError,
  NotAuthorizedError,
  NotFoundError,
};
