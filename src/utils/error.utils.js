//Custom error class with status code
export class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  //Catch async errors in route handlers
  export const catchAsync = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };
  
  //Handle validation errors from mongoose
  export const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
  };
  
  //Handle JWT errors
  export const handleJWTError = () => 
    new AppError('Invalid token. Please log in again.', 401);
  
  //Handle JWT expired errors
  export const handleJWTExpiredError = () => 
    new AppError('Your token has expired. Please log in again.', 401);