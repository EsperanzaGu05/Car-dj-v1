import express from 'express';
import { processPayment, handlePaymentSuccess, getSubscriptionStatus, cancelSubscription, verifyPayment } from '../Controllers/paymentController.js';

const router = express.Router();

// Existing routes
router.post('/payment/process', processPayment);
router.post('/payment/success', handlePaymentSuccess);
router.get('/subscription-status/:userId', getSubscriptionStatus);
router.post('/subscription/cancel/:userId', cancelSubscription);
router.post('/verify-payment', verifyPayment);

export default router;
