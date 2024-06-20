import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google/callback', 
  (req, res, next) => {
    console.log("Google callback route hit");
    next();
  },
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);


export default router;
