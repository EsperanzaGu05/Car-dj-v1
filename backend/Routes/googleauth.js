import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Function to generate JWT token
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
  console.log('JWT Token generated:', token);
  console.log('Token contents:', jwt.decode(token));
  return token;
};

// Route for Google signup
router.get('/google/signup', passport.authenticate('google', {
  scope: ['profile', 'email'],
  state: 'signup'
}));

// Route for Google login
router.get('/google/login', passport.authenticate('google', {
  scope: ['profile', 'email'],
  state: 'login'
}));

// Google callback route
router.get('/google/callback', (req, res, next) => {
  const isSignup = req.query.state === 'signup';

  passport.authenticate('google', async (err, user, info) => {
    console.log('Google authentication callback triggered');
    if (err) {
      console.error('Error during Google authentication:', err);
      return res.redirect(`http://localhost:5173/?status=error&message=${encodeURIComponent('Internal Server Error')}`);
    }
    if (!user) {
      console.log('Google authentication failed, user not found');
      return res.redirect(`http://localhost:5173/?status=error&message=${encodeURIComponent(info ? info.message : 'Authentication failed')}`);
    }

    try {
      if (isSignup && info && info.message === 'User already exists') {
        return res.redirect(`http://localhost:5173/?status=error&message=${encodeURIComponent('User already exists')}`);
      }

      req.logIn(user, (err) => {
        if (err) {
          console.error('Error during req.logIn:', err);
          return res.redirect(`http://localhost:5173/?status=error&message=${encodeURIComponent('Login failed')}`);
        }
        console.log('User successfully logged in:', user);

        // Generate a token for the user
        const token = generateToken(user._id);

        if (isSignup) {
          // Redirect after signup
          return res.redirect(`http://localhost:5173/?status=success&message=${encodeURIComponent('Google signup successful. You can now log in.')}`);
        } else {
          // Redirect after login
          return res.redirect(`http://localhost:5173/?status=success&token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&userId=${user._id}`);
        }
      });
    } catch (error) {
      console.error('Error during user processing:', error);
      res.redirect(`http://localhost:5173/?status=error&message=${encodeURIComponent('Internal Server Error')}`);
    }
  })(req, res, next);
});

export default router;
