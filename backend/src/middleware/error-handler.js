export function notFoundError(message = "Resource not found") {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

export function badRequestError(message = "Bad request") {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

export function unauthorizedError(message = "Unauthorized") {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
}

export function conflictError(message = "Conflict") {
  const error = new Error(message);
  error.statusCode = 409;
  return error;
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({ message });
}
