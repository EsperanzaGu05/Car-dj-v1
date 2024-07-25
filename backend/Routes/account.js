import express from 'express';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { getDB } from '../Database/connection.js';
import collections from '../Database/collections.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user details
router.get('/', authMiddleware, async (req, res) => {
  console.log('GET /api/account - User ID:', req.userId);
  const db = getDB();
  try {
    const user = await db.collection(collections.USER).findOne({ _id: new ObjectId(req.userId) });
    if (!user) {
      console.log('User not found for ID:', req.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user);
    res.json({ name: user.name, email: user.email });
  } catch (error) {
    console.error('Error in /api/account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user details
router.put('/', authMiddleware, async (req, res) => {
  const { name, password } = req.body;
  const db = getDB();
  try {
    console.log('Updating user details for userId:', req.userId);
    const user = await db.collection(collections.USER).findOne({ _id: new ObjectId(req.userId) });
    if (!user) {
      console.log(`User with userId ${req.userId} not found for update`);
      return res.status(404).json({ message: 'User not found' });
    }

    const updates = { name };

    if (password) {
      // Check if the new password is the same as the current one
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: "New password must be different from the current password" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    const result = await db.collection(collections.USER).updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: updates }
    );

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes were made' });
    }

    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/sub', authMiddleware, async (req, res) => {
  const db = getDB();
  try {
    const user = await db.collection(collections.USER).findOne({ _id: new ObjectId(req.userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("User data:", user); // Log the entire user object
    res.json({
       name: user.name,
       email: user.email,
       subscription: user.subscription || {} // Return an empty object if subscription is null
    });
  } catch (error) {
    console.error('Error fetching user data:', error); // Add this line
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;