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
      return res.status(409).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Error during req.logIn:', err);
        return res.status(500).json({ message: 'Login failed' });
      }
      console.log('User successfully logged in');
      return res.redirect('/');
    });
  })(req, res, next);
});

export default router;
