import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

router.get('/google/signup', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  state: 'signup'
}));

router.get('/google/login', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  state: 'login'
}));

router.get('/google/callback', (req, res, next) => {
  const isSignup = req.query.state === 'signup';

  passport.authenticate('google', (err, user, info) => {
    console.log('Google authentication callback triggered');
    if (err) {
      console.error('Error during Google authentication:', err);
      return res.redirect(`http://localhost:5173/?status=error&message=${encodeURIComponent('Internal Server Error')}`);
    }
    if (!user) {
      console.log('Google authentication failed, user not found');
      return res.redirect(`http://localhost:5173/?status=error&message=${encodeURIComponent(info ? info.message : 'Authentication failed')}`);
    }

    if (isSignup && info && info.message === 'User already exists') {
      return res.redirect(`http://localhost:5173/?status=error&message=${encodeURIComponent('User already exists')}`);
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Error during req.logIn:', err);
        return res.redirect(`http://localhost:5173/?status=error&message=${encodeURIComponent('Login failed')}`);
      }
      console.log('User successfully logged in:', user);
      
      const token = generateToken(user._id);
      
      if (isSignup) {
        return res.redirect(`http://localhost:5173/?status=success&message=${encodeURIComponent('Google signup successful. You can now log in.')}`);
      } else {
        return res.redirect(`http://localhost:5173/?status=success&token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
      }
    });
  })(req, res, next);
});

router.post("/login/google", (req, res, next) => {
  passport.authenticate('google-token', { session: false }, (err, user, info) => {
    if (err) {
      console.error("Error during Google token authentication:", err);
      return res.status(500).json({ message: "Error authenticating with Google" });
    }
    if (!user) {
      return res.status(401).json({ message: "Google authentication failed" });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      name: user.name,
      email: user.email,
      isNewUser: info && info.message === 'New user created'
    });
  })(req, res, next);
});

export default router;