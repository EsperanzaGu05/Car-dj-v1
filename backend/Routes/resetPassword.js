import express from 'express';
import bcrypt from 'bcrypt';
import { getDB } from '../Database/connection.js';
import collections from '../Database/collections.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,}$/;
  return regex.test(password);
};

router.get('/:token', async (req, res) => {
  const { token } = req.params;
  const db = getDB();

  try {
    const tempUser = await db.collection(collections.TEMP).findOne({ token });
    if (!tempUser || tempUser.expireAt < Date.now()) {
      return res.status(400).json({ message: 'Expired Link' });
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

  if (!validatePassword(newPassword)) {
    return res.status(400).json({ message: 'Password does not meet the requirements' });
  }

  try {
    const tempUser = await db.collection(collections.TEMP).findOne({ token });

    if (!tempUser || tempUser.expireAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
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