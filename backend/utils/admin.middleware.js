export const adminMiddleware = (req, res, next) => {
  // This middleware runs *after* authMiddleware, so we know req.user exists.
  // We check the 'role' property that was attached to the JWT payload.
  if (req.user && req.user.role === 'admin') {
    // If the user is an admin, allow the request to proceed to the controller.
    next();
  } else {
    // If the user is not an admin, send a "Forbidden" status.
    // It's important to use 403 Forbidden, not 401 Unauthorized.
    // 401 means "You are not logged in."
    // 403 means "I know who you are, but you are not allowed to access this."
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};
