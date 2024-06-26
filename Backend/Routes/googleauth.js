import express from 'express';
import passport from '../Controllers/googleAuth.js';

const router = express.Router();

// Initiate Google authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback URL
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    console.log('Google authentication callback triggered');
    if (err) {
      console.error('Error during Google authentication:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (!user) {
      console.log('Google authentication failed, user not found');
      return res.status(409).json({ message: info ? info.message : 'User not found' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error during req.logIn:', err);
        return res.status(500).json({ message: 'Login failed' });
      }
      console.log('User successfully logged in:', user);
      // Redirect to the frontend route after successful login
      return res.redirect('http://localhost:5173');  // Adjust as needed
    });
  })(req, res, next);
});

// Logout and clear cookies
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Session destruction failed' });
      }
      res.clearCookie('connect.sid', { path: '/' });
      return res.redirect('http://localhost:5173');  // Redirect to your homepage or login page
    });
  });
});

export default router;
