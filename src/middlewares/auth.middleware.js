import passport from 'passport';

// Middleware to authenticate using JWT strategy
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({ 
        status: false,
        message: 'Authentication required. Please log in.'
      });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

// Check if user owns the resource or is an admin
const authorizeResource = (resourceModel) => async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const userId = req.user._id;

    const resource = await resourceModel.findById(resourceId);

    if (!resource || resource.isDeleted) {
      return res.status(404).json({ 
        status: false,
        message: 'Resource not found' });
    }

    const ownerId = resource.userId || resource.user;
    if (!ownerId || ownerId.toString() !== userId.toString()) {
      return res.status(403).json({
        status: false,
        message: 'You do not have permission to perform this action'
      });
    }
    req.resource = resource; // in case you need it in controller
    next();
  } catch (err) {
    console.error('Authorization error:', err);
    res.status(500).json({ 
      status: false,
      message: 'Internal server error'
     });
  }
};
export{
  authenticate,
  authorizeResource
};