import express from 'express';
import bcrypt from 'bcrypt';
import { getDB } from '../Database/connection.js';
import collections from '../Database/collections.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const db = getDB();

  try {
    const user = await db.collection(collections.USER).findOne({ email });
    if (!user) {
      console.log(`User with email ${email} not found`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Password does not match for user with email ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`User ${email} logged in successfully`);
    return res.status(200).json({
      token,
      name: user.name, 
      email: user.email
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
