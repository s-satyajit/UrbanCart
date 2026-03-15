function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}
export function notFoundError(message = "Resource not found") {
    return createError(message, 404);
}
export function badRequestError(message = "Bad request") {
    return createError(message, 400);
}
export function unauthorizedError(message = "Unauthorized") {
    return createError(message, 401);
}
export function conflictError(message = "Conflict") {
    return createError(message, 409);
}
export function errorHandler(error, req, res, next) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    if (statusCode >= 500) {
        console.error(error);
    }
    res.status(statusCode).json({ message });
}
