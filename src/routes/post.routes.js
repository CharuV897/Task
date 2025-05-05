import express from 'express';
import * as postController from '../controllers/post.controller.js';
import { authenticate, authorizeResource } from '../middlewares/auth.middleware.js';
import { handleUploadErrors } from '../middlewares/upload.middleware.js';
import { validatePost } from '../middlewares/validation.middleware.js';
import Post from '../models/post.model.js';

const router = express.Router();

// POST /api/posts - Create a new post (protected)
router.post('/', authenticate, handleUploadErrors, validatePost, postController.createPost);

// GET /api/posts - Get all posts (public)
 router.get('/', postController.getAllPosts);

// GET /api/posts/:id - Get a single post by ID (public)
 router.get('/:id', postController.getPostById);

// DELETE /api/posts/:id - Delete a post (protected, owner only)
 router.delete('/:id', authenticate, authorizeResource(Post), postController.deletePost);

// POST /api/posts/:id/like - Like a post (protected)
 router.post('/:id/like', authenticate, postController.likePost);

// POST /api/posts/upload - Upload image for a post (protected)
 router.post('/upload', authenticate, handleUploadErrors, postController.uploadImage);

export default router;