import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { getDB } from '../Database/connection.js';
import collections from '../Database/collections.js';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.Front}/api/auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
  const db = getDB();
  const email = profile.emails[0].value;

  try {
    let user = await db.collection(collections.USER).findOne({ email });
    if (user) {
      return done(null, false, { message: "Email already registered" });
    } else {
      const newUser = await db.collection(collections.USER).insertOne({
        name: profile.displayName,
        email: email,
        googleId: profile.id,
      });
      return done(null, newUser.ops[0]);
    }
  } catch (error) {
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
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
