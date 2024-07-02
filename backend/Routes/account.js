import express from 'express';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb'; // Import ObjectId to use with MongoDB
import { getDB } from '../Database/connection.js';
import collections from '../Database/collections.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Middleware to authenticate JWT

const router = express.Router();

// Get user details
router.get('/', authMiddleware, async (req, res) => {
  const db = getDB();
  try {
    console.log('Fetching user details for userId:', req.userId); // Log userId
    const user = await db.collection(collections.USER).findOne({ _id: ObjectId(req.userId) });
    if (!user) {
      console.log(`User with userId ${req.userId} not found`); // Log user not found
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update user details
router.put('/', authMiddleware, async (req, res) => {
  const { name, password } = req.body;
  const db = getDB();
  try {
    console.log('Updating user details for userId:', req.userId); // Log userId
    const updates = { name };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }
    const result = await db.collection(collections.USER).updateOne(
      { _id: ObjectId(req.userId) },
      { $set: updates }
    );
    if (result.matchedCount === 0) {
      console.log(`User with userId ${req.userId} not found for update`); // Log user not found
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;