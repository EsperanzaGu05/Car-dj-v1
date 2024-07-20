import { getDB } from '../Database/connection.js';
import collections from '../Database/collections.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Process Payment
export const processPayment = async (req, res) => {
  console.log('processPayment called with body:', req.body);
  const { email } = req.body;
  const db = getDB();

  try {
    const user = await db.collection(collections.USER).findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Creating Stripe session for user:', user._id.toString());

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Subscription',
            },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.Front}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.Front}/payment/cancel`,
      client_reference_id: user._id.toString(),
    });

    console.log('Created Stripe session:', session);
    console.log('Success URL:', `${process.env.Front}/payment/success?session_id={CHECKOUT_SESSION_ID}`);

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const handlePaymentSuccess = async (req, res) => {
  console.log('handlePaymentSuccess called with body:', req.body);
  const { session_id } = req.body;
  const db = getDB();

  try {
    console.log('Retrieving Stripe session:', session_id);
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log('Retrieved Stripe session:', session);

    const userId = session.client_reference_id;

    if (!userId) {
      console.log('Client reference ID not found in Stripe session');
      return res.status(400).json({ message: 'Client reference ID not found in Stripe session' });
    }

    if (session.payment_status === 'paid') {
      console.log('Payment status is paid. Updating user subscription.');
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now

      const result = await db.collection(collections.USER).updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            'subscription.startDate': startDate,
            'subscription.endDate': endDate,
            'subscription.type': 'premium',
            'subscription.status': 'Subscribed',
          },
        }
      );

      if (result.modifiedCount === 0) {
        console.log('User not found or subscription not updated for userId:', userId);
        return res.status(404).json({ message: 'User not found or subscription not updated' });
      }

      console.log('Subscription updated successfully for userId:', userId);
      res.status(200).json({ message: 'Subscription updated successfully' });
    } else {
      console.log('Payment status:', session.payment_status);
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get Subscription Status
export const getSubscriptionStatus = async (req, res) => {
  console.log('getSubscriptionStatus called with params:', req.params);
  const { userId } = req.params;
  const db = getDB();

  try {
    const user = await db.collection(collections.USER).findOne({ _id: new ObjectId(userId) });
    if (!user) {
      console.log('User not found for userId:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    const subscriptionStatus = user.subscription?.status || 'Not Subscribed';
    console.log('Subscription status for userId:', userId, 'is:', subscriptionStatus);
    res.status(200).json({ status: subscriptionStatus });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Cancel Subscription
export const cancelSubscription = async (req, res) => {
  console.log('cancelSubscription called with params:', req.params);
  const { userId } = req.params;
  const db = getDB();

  try {
    const result = await db.collection(collections.USER).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          'subscription.status': 'Cancelled',
          'subscription.endDate': new Date(), // Set end date to now
        },
      }
    );

    if (result.modifiedCount === 0) {
      console.log('User not found or subscription not active for userId:', userId);
      return res.status(404).json({ message: 'User not found or subscription not active' });
    }

    console.log('Subscription cancelled successfully for userId:', userId);
    res.status(200).json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Verify Payment (assuming user is authenticated and userId is extracted from token)
export const verifyPayment = async (req, res) => {
  console.log('verifyPayment called with body:', req.body);
  const { sessionId } = req.body;
  const userId = req.user.id; // Assuming you have middleware to extract user from token

  try {
    console.log('Retrieving Stripe session:', sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Retrieved Stripe session:', session);

    if (session.payment_status === 'paid') {
      console.log('Payment status is paid. Updating user subscription.');
      const db = getDB();
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now

      await db.collection(collections.USER).updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            'subscription.startDate': startDate,
            'subscription.endDate': endDate,
            'subscription.status': 'Subscribed',
          },
        }
      );

      console.log('Subscription activated successfully for userId:', userId);
      res.json({ success: true, message: 'Subscription activated successfully' });
    } else {
      console.log('Payment not completed for sessionId:', sessionId);
      res.json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};