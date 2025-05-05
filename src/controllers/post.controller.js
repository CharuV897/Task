import Post from '../models/post.model.js';
import Like from '../models/like.model.js';
import { uploadImageToS3 } from '../services/upload.service.js';

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user._id;
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImageToS3(req.file);
    }

    const newPost = await Post.create({
      title,
      content,
      imageUrl,
      userId: userId
    });

    res.status(201).json({
      status: true,
      message: 'Post created successfully',
      data: newPost
    });
  } catch (error) {
    console.error('Post creation error:', error);
    return res.status(500).json({
      status: false,
      message: 'failed to create post',
      data: null,
    })
  }
};

// Get all posts
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()  

    const result = await Promise.all(posts.map(async post => {
      const likesCount = await Like.countDocuments({ post: post._id });

      return {
        _id: post._id,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        user: post.user,
        likesCount
      };
    }));

    res.status(200).json({
      status: true,
      message: 'All posts fetched',
      data: result
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    return res.status(500).json({
      status: false,
      message: "failed to fetch posts",
      data: null,
    });
  }
};

// Get single post by ID
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      status: true,
      message: 'Post fetched successfully',
      data: {
        _id: post._id,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
        user: post.user,
        likesCount: post.likesCount || 0
      }
    });
  } catch (error) {
    console.error('fetch post error:', error);
    return res.status(500).json({
      status: false,
      message: "failed to fetch post",
      data: null,
    });
  }
};

// Delete post
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: false,
        message: 'Post not found'
      });
    }

    post.isDeleted = true;
    await post.save();

    res.status(200).json({
      status: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Deleting post error:', error);
    return res.status(500).json({
      status: false,
      message: "failed to delete post",
      data: null,
    });
  }
};

const likePost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        status: false, 
        message: 'Post not found',
        data: null 
      });
    }

    // Check if already liked
    const existingLike = await Like.findOne({ post: postId, user: userId });
    if (existingLike) {
      return res.status(400).json({ 
        status: false, 
        message: 'You already liked this post' 
      });
    }

    // Create a new like
    await Like.create({ post: postId, user: userId });

     res.status(200).json({ 
      status: true, 
      message: 'Post liked successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
      data: null,
    });
    }
};

// Upload image (separate from post creation)
const uploadImage = async (req, res, next) => {
  try {
    const { postId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: 'No image file uploaded',
      });
    }

    if (!postId) {
      return res.status(400).json({
        status: false,
        message: 'postId is required',
      });
    }

    const imageUrl = await uploadImageToS3(req.file);

    // Update the post with the image URL
const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { imageUrl },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Image uploaded and post updated successfully',
      data: {
        imageUrl,
        postId: updatedPost._id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

export {
  createPost, 
  getAllPosts, 
  getPostById, 
  deletePost, 
  likePost, 
  uploadImage
};