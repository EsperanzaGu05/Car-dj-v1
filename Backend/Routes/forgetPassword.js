import express from 'express';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { getDB } from '../Database/connection.js';
import collections from '../Database/collections.js';
import { sendMail } from '../mail/mail.js';

const router = express.Router();

router.post('/request', async (req, res) => {
  const { email } = req.body;
  const db = getDB();

  try {
    const user = await db.collection(collections.USER).findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expireAt = Date.now() + 3600000; // 1 hour

    await db.collection(collections.TEMP).insertOne({
      email,
      token,
      expireAt
    });

    const emailTemplatePath = path.resolve(`${path.dirname("")}/mail/static/resetPassword.html`);
    const html = await fs.promises.readFile(emailTemplatePath, "utf-8");

    const preparedHtml = html.replace("[LINK]", `${process.env.SITE_URL}/api/reset-password/${token}`);

    sendMail(
      {
        to: email,
        subject: 'Password Reset Request',
        html: preparedHtml,
      },
      (err, done) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to send email' });
        } else {
          return res.status(200).json({ message: 'Password reset email sent successfully' });
        }
      }
    );
  } catch (error) {
    console.error('Error during password reset request:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
