import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Auth Header:', authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted Token:', token);

  if (token == null) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log('Decoded token:', decoded);
    req.userId = decoded.userId || decoded.id; // Check for both userId and id
    console.log('Token verified, user ID:', req.userId);
    next();
  });
};

export default authMiddleware;