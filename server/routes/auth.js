const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

// Secret keys for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key';

/**
 * 1. SEND OTP (Customer Login)
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone is required' });

    // Generate Live 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = new Date(Date.now() + 5 * 60000); // 5 minutes expiry

    // Save or update OTP in DB
    await prisma.otpVerification.upsert({
      where: { phone },
      update: { otp, expiry, verified: false },
      create: { phone, otp, expiry }
    });

    // Fire Live SMS Gateway to 2Factor.in
    const apiKey = 'a4f42790-1574-11f1-bcb0-0200cd936042';
    const templateName = 'AppDostLogin';
    const gatewayUrl = `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${otp}/${templateName}`;

    try {
      // Using global Node fetch
      const smsResponse = await fetch(gatewayUrl);
      const smsResult = await smsResponse.json();
      console.log(`[LIVE SMS GATEWAY] Dispatch Status: ${smsResult.Status} | Sent to ${phone}`);
    } catch (err) {
      console.error('[LIVE SMS GATEWAY ERROR] Failed to hit 2Factor API:', err.message);
    }

    res.json({ message: 'Live OTP sent successfully via AppDost Gateway', expires_in: '5 minutes' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
});

/**
 * 2. VERIFY OTP & LOGIN (Customer)
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const record = await prisma.otpVerification.findUnique({ where: { phone } });

    if (!record || record.otp !== otp || new Date() > record.expiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark as verified
    await prisma.otpVerification.update({
      where: { phone },
      data: { verified: true }
    });

    // Login or Register customer
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: { phone, role: 'CUSTOMER' }
      });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
});

/**
 * 3. LOGIN WITH EMAIL/PASS (Vendor or Admin)
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role === 'CUSTOMER') {
      return res.status(401).json({ message: 'Invalid credentials or unauthorized' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

/**
 * 4. COMPLETE PROFILE (For New Users)
 */
router.post('/update-profile', async (req, res) => {
  try {
    // Basic auth check inline since auth.js doesn't have the middleware imported
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch(err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required to complete profile.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { name, email }
    });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ message: 'This email is already registered.' });
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

/**
 * 5. GET CURRENT USER PROFILE
 */
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No signature provided' });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId },
      select: { id: true, name: true, phone: true, email: true, role: true, createdAt: true }
    });
    
    if (!user) return res.status(404).json({ message: 'User not found in database' });
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Session expired or invalid', error: error.message });
  }
});

module.exports = router;
