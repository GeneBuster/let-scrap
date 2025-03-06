const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']; // Get the token from headers
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
  
    // Here, you would typically verify the token (using something like JWT)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Assuming you use JWT
      req.user = decoded;  // Attach user info to the request object
      next();  // Pass control to the next route handler
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
  