import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      default: null
    },
    likesCount: {
      type: Number,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true }
  }
);

// Virtual for likes to avoid fetching all likes
postSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'post'
});

// Filter out deleted posts by default
postSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Update likes count when a post is fetched
postSchema.post(/^find/, async function(docs) {
  if (!docs) return;
  
  // If it's a single document
  if (!Array.isArray(docs)) {
    if (docs._id) {
      const Like = mongoose.model('Like');
      docs.likesCount = await Like.countDocuments({ post: docs._id });
    }
    return;
  }
  
  // If it's an array of documents
  if (docs.length > 0) {
    const Like = mongoose.model('Like');
    
    for (const doc of docs) {
      if (doc._id) {
        doc.likesCount = await Like.countDocuments({ post: doc._id });
      }
    }
  }                                              
});

const Post = mongoose.model('Post', postSchema);

export default Post;