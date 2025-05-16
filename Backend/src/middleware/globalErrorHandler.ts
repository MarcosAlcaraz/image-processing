import { Request, Response, NextFunction } from 'express';
import multer from 'multer'; // To check for MulterError instance

// Define a more specific type for your error response if you like
interface ErrorResponse {
  name: string;
  message: string;
  stack?: string;
  details?: any; // For things like Mongoose validation errors array
}

export const globalErrorHandler = (
  err: any, // Using 'any' for err to handle various error shapes, but you can create a more specific Error type
  req: Request,
  res: Response,
  next: NextFunction // 'next' is not typically used in the final error handler, but Express requires its signature
): void => {
  console.error("-------------------------- ERROR STACK --------------------------");
  console.error(err); // Log the full error object for detailed server-side debugging
  console.error("-----------------------------------------------------------------");

  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred on the server.'; // Default generic message
  let errorName = err.name || 'Error';
  let errorDetails: any; // For more structured error details like validation arrays

  // Mongoose Validation Errors
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400; // Bad Request
    message = 'Validation failed. Please check your input.';
    errorName = 'ValidationError';
    errorDetails = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
      value: e.value, // Optional: include the value that failed validation
    }));
  }
  // Mongoose CastErrors (e.g., invalid ObjectId format)
  else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400; // Bad Request
    message = `Invalid ID format provided for resource path: ${err.path}. Expected a valid ObjectId.`;
    errorName = 'CastError';
    errorDetails = { path: err.path, value: err.value };
  }
  // Multer errors
  else if (err instanceof multer.MulterError) {
    statusCode = 400; // Bad Request
    message = `File upload error: ${err.message}`; // Multer's message is usually informative
    errorName = 'MulterError';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File is too large. Please ensure it is within the allowed size limit.';
    }
    // You can add more specific Multer error codes here
    // e.g., LIMIT_FILE_COUNT, LIMIT_UNEXPECTED_FILE
    errorDetails = { code: err.code, field: err.field };
  }
  // Custom application errors might have a 'statusCode' and 'isOperational' flag
  else if (err.isOperational) { // A flag you might set on your custom errors
    // Use the error's own status and message
  }

  // If it's an unexpected server error and status code is still 2xx (which shouldn't happen if error is thrown correctly)
  // or if no specific status code was set from the error object, default to 500.
  if (statusCode < 400 || statusCode > 599 || (res.statusCode === 200 && statusCode !== err.statusCode)) {
      statusCode = 500;
      message = 'An unexpected internal server error occurred.';
      errorName = 'InternalServerError';
  }


  const errorResponsePayload: { error: ErrorResponse } = {
    error: {
      name: errorName,
      message: message,
    },
  };

  if (errorDetails) {
    errorResponsePayload.error.details = errorDetails;
  }

  // Only include stack trace in development environment
  if (process.env.NODE_ENV === 'development' && err.stack) {
    errorResponsePayload.error.stack = err.stack;
  }

  // Ensure headers haven't already been sent
  if (!res.headersSent) {
    res.status(statusCode).json(errorResponsePayload);
  } else {
    // If headers were already sent, delegate to the default Express error handler
    // which closes the connection and fails the request.
    next(err);
  }
};