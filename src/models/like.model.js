import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure a user can only like a post once
likeSchema.index({ post: 1, user: 1 }, { unique: true });

// Update post likesCount when a like is created or removed
likeSchema.statics.updatePostLikesCount = async function(postId) {
  const Post = mongoose.model('Post');
  const likesCount = await this.countDocuments({ post: postId });
  
  await Post.findByIdAndUpdate(postId, { likesCount });
};

// After saving a new like, update the post's likesCount
likeSchema.post('save', async function() {
  await this.constructor.updatePostLikesCount(this.post);
});

// After removing a like, update the post's likesCount
likeSchema.post('deleteOne', { document: true }, async function() {
  await this.constructor.updatePostLikesCount(this.post);
});

const Like = mongoose.model('Like', likeSchema);

export default Like;