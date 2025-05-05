import { AppError } from '../utils/error.utils.js';

//Validates post data
const validatePost = (req, res, next) => {
  const { title, content } = req.body;
  const errors = [];
  
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (title && title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }
  
  if (!content || content.trim() === '') {
    errors.push('Content is required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      status: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

// Validates user registration data
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  
  const errors = [];
  
  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!email || !isValidEmail(email)) {
    errors.push('Valid email is required');
  }
  
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      status: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

// Validates login data
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  const errors = [];
  
  if (!email || !isValidEmail(email)) {
    errors.push('Valid email is required');
  }
  
  if (!password) {
    errors.push('Password is required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      status: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};
export {
  validatePost,
  validateRegistration,
  validateLogin,
};