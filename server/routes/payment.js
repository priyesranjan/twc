const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// In production, these should be truly secret ENV vars
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyIdHere',
  key_secret: process.env.RAZORPAY_SECRET || 'mockSecretHere12345',
});

/**
 * 1. CREATE ORDER (Initiate Payment for Vendor Booking Token)
 */
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, bookingId } = req.body;

    // Minimum Token Advance is usually ₹10,000 for venues
    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency,
      receipt: `receipt_booking_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).json({ message: "Razorpay Error" });

    // Assuming we have an authenticated user...
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
});

/**
 * 2. VERIFY PAYMENT (Callback after UI success)
 */
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET || 'mockSecretHere12345')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment Verified! Update Booking status in DB
      /*
      await prisma.payment.create({
        data: {
          bookingId: bookingId,
          amount: ... ,
          status: 'SUCCESS',
          transactionId: razorpay_payment_id,
          paymentMethod: 'RAZORPAY'
        }
      });
      */
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
});

module.exports = router;
