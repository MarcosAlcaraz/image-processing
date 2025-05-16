import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

interface ErrorResponse {
  name: string;
  message: string;
  stack?: string;
  details?: any;
}

export const globalErrorHandler = (
  err: any, 
  req: Request,
  res: Response,
  next: NextFunction 
): void => {
  console.error("-------------------------- ERROR STACK --------------------------");
  console.error(err);
  console.error("-----------------------------------------------------------------");

  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred on the server.'; 
  let errorName = err.name || 'Error';
  let errorDetails: any; 

  // mongoose Valiadtion Errors
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = 'Validation failed. Please check your input.';
    errorName = 'ValidationError';
    errorDetails = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
      value: e.value, 
    }));
  }
  else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400; 
    message = `Invalid ID format provided for resource path: ${err.path}. Expected a valid ObjectId.`;
    errorName = 'CastError';
    errorDetails = { path: err.path, value: err.value };
  }
  // multer errors
  else if (err instanceof multer.MulterError) {
    statusCode = 400; 
    message = `File upload error: ${err.message}`; 
    errorName = 'MulterError';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File is too large. Please ensure it is within the allowed size limit.';
    }
    
    errorDetails = { code: err.code, field: err.field };
  }
  else if (err.isOperational) { 
  }

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

  if (process.env.NODE_ENV === 'development' && err.stack) {
    errorResponsePayload.error.stack = err.stack;
  }

  if (!res.headersSent) {
    res.status(statusCode).json(errorResponsePayload);
  } else {
    next(err);
  }
};