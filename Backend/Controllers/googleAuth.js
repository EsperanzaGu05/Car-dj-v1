import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { getDB } from '../Database/connection.js';
import collections from '../Database/collections.js';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SITE_URL}/api/auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
  const db = getDB();
  const email = profile.emails[0].value;

  try {
    console.log('Google authentication callback triggered for email:', email);
    
    // Check if user already exists
    let user = await db.collection(collections.USER).findOne({ email });

    if (user) {
      // User already exists, pass the information to the callback
      console.log('User already exists:', user);
      return done(null, user, { message: "Email already registered" });
    } else {
      // Create a new user if not exists
      const newUser = {
        name: profile.displayName,
        email: email,
        googleId: profile.id,
        subscription: {
          startDate: null,
          endDate: null,
          status: 'none'
        }
      };
      const result = await db.collection(collections.USER).insertOne(newUser);
      console.log('New user created:', result.ops[0]);
      return done(null, result.ops[0]);
    }
  } catch (error) {
    console.error('Error during Google authentication:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const db = getDB();
  try {
    const user = await db.collection(collections.USER).findOne({ _id: id });
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (error) {
    console.error('Error during deserialization:', error);
    done(error, null);
  }
});

export default passport;
