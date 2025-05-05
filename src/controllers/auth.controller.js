import { hashPassword, comparePassword, generateToken } from '../utils/authUtils.js';
import User from '../models/user.model.js';
import passport from 'passport';

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: 'User with this email already exists',
        data: null
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create JWT token
    // const token = generateToken(user);

    return res.status(201).json({
      status: true,
      message: 'User registered successfully',
      data: user,
      // token: token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      status: false,
      message: 'Registration failed',
      data: null,
    });
  }
};

// Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Invalid email or password',
        data: null
      });
    }

    // Check if password exists (for OAuth users)
    if (!user.password) {
      return res.status(401).json({
        status: false,
        message: 'This account uses social login. Please login with the appropriate provider.',
        data: null
      });
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: 'Invalid email or password',
        data: null
      });
    }

    // Create JWT token
    const token = generateToken(user);

    return res.status(200).json({
      status: true,
      message: 'Login successful',
      data: user,
      token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: false,
      message: 'Login failed',
      data: null,
    });
  }
};

// Google OAuth login
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
});

// Google OAuth callback
const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google authentication error:', err);
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Google authentication failed',
        data: null
      });
    }

    // Generate token
    const token = generateToken(user);

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  })(req, res, next);
};

// Facebook OAuth login
const facebookAuth = passport.authenticate('facebook', {
  scope: ['email'],
  session: false
});

// Facebook OAuth callback
const facebookCallback = (req, res, next) => {
  passport.authenticate('facebook', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Facebook authentication failed',
        data: null
      });
    }

    // Generate token
    const token = generateToken(user);

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  })(req, res, next);
};

// Export controllers
export { 
  register, 
  login, 
  googleAuth, 
  googleCallback, 
  facebookAuth, 
  facebookCallback 
};