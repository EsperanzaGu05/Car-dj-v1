import express from 'express';
import bcrypt from 'bcrypt';
import { getDB } from '../Database/connection.js';
import collections from '../Database/collections.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/:token', async (req, res) => {
  const { token } = req.params;
  const db = getDB();

  try {
    const tempUser = await db.collection(collections.TEMP).findOne({ token });
    if (!tempUser || tempUser.expireAt < Date.now()) {
      return res.status(400).json({ message: 'Link is Expired' });
    }

    res.status(200).json({ email: tempUser.email });
  } catch (error) {
    console.error('Error during password reset:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const db = getDB();

  try {
    const tempUser = await db.collection(collections.TEMP).findOne({ token });

    if (!tempUser || tempUser.expireAt < Date.now()) {
      return res.status(400).json({ message: 'Link is Expired' });
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
    }

    // Check if the new password is different from the current one
    const user = await db.collection(collections.USER).findOne({ email: tempUser.email });
    if (user && user.password) {
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: 'New password must be different from the current password' });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection(collections.USER).updateOne(
      { email: tempUser.email },
      { $set: { password: hashedPassword } }
    );

    await db.collection(collections.TEMP).deleteOne({ _id: new ObjectId(tempUser._id) });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error during password reset:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;