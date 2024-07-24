import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GoogleTokenStrategy } from 'passport-google-token';
import dotenv from 'dotenv';
import { getDB } from '../Database/connection.js';
import collections from '../Database/collections.js';
import { ObjectId } from 'mongodb';

dotenv.config();

const googleStrategyHandler = async (accessToken, refreshToken, profile, done) => {
  const db = getDB();
  console.log('Google profile:', profile);

  let email = null;
  if (profile.emails && profile.emails.length > 0) {
    email = profile.emails[0].value;
  }

  if (!email) {
    console.error('No email found in Google profile');
    return done(new Error('No email found in Google profile'), null);
  }

  try {
    console.log('Google authentication callback triggered for email:', email);

    let user = await db.collection(collections.USER).findOne({ email });

    if (user) {
      console.log('User already exists:', user);
      return done(null, user, { message: "User already exists" });
    } else {
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
      
      const createdUser = await db.collection(collections.USER).findOne({ _id: result.insertedId });
      
      console.log('New user created:', createdUser);
      return done(null, createdUser, { message: "New user created" });
    }
  } catch (error) {
    console.error('Error during Google authentication:', error);
    return done(error, null);
  }
};

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SITE_URL}/api/auth/google/callback`
}, googleStrategyHandler));

passport.use(new GoogleTokenStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, googleStrategyHandler));

passport.serializeUser((user, done) => {
  console.log('Serializing user with ID:', user._id);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const db = getDB();
  console.log('Deserializing user with ID:', id);

  // Validate if id is a valid 24-character hex string
  if (!ObjectId.isValid(id)) {
    console.error('Invalid ID format:', id);
    return done(new Error('Invalid ID format'), null);
  }

  try {
    const user = await db.collection(collections.USER).findOne({ _id: new ObjectId(id) });
    if (user) {
      console.log('User found:', user);
      done(null, user);
    } else {
      console.error('User not found for ID:', id);
      done(new Error('User not found'), null);
    }
  } catch (error) {
    console.error('Error during deserialization:', error);
    done(error, null);
  }
});

export default passport;
