import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', authController.register);

// POST /api/auth/login - Login with email and password
router.post('/login', authController.login);

// GET /api/auth/google - Google OAuth login
router.get('/google', authController.googleAuth);

// GET /api/auth/google/callback - Google OAuth callback
router.get('/google/callback', authController.googleCallback);

// GET /api/auth/facebook - Facebook OAuth login
router.get('/facebook', authController.facebookAuth);

// GET /api/auth/facebook/callback - Facebook OAuth callback
router.get('/facebook/callback', authController.facebookCallback);

export default router;