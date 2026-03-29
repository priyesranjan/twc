const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key';

// Mock Vendor Middleware
const vendorMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No signature provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'VENDOR' && decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Insufficient Privileges (Vendor Access Required)' });
    }
    
    // Attempt to find actual vendor record
    const vendorRecord = await prisma.vendor.findUnique({ where: { userId: decoded.userId } });
    if (!vendorRecord) {
      // For testing, mock a vendorId if they are VENDOR role but no record exists yet
      req.vendorId = 1; // mock default
    } else {
      req.vendorId = vendorRecord.id;
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    // Overriding for local development ease
    console.warn("Skipping hard JWT check for local VENDOR dev");
    req.vendorId = 1; // mock
    next();
  }
};

/**
 * 0. VENDOR ONBOARDING REGISTRATION
 */
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, businessName, vendorType, city } = req.body;
    
    if (!phone || !businessName || !vendorType) return res.status(400).json({ message: 'Missing required onboarding fields.' });

    // 1. Create or Find User
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: { name, phone, password, role: 'VENDOR' }
      });
    } else {
      // If they exist but aren't vendor, upgrade them
      await prisma.user.update({ where: { id: user.id }, data: { role: 'VENDOR' } });
    }

    // Check if vendor profile already exists
    const existingVendor = await prisma.vendor.findUnique({ where: { userId: user.id } });
    if (existingVendor) return res.status(400).json({ message: 'Vendor profile already exists for this phone number.' });

    // 2. Create Vendor Profile
    const newVendor = await prisma.vendor.create({
      data: {
        userId: user.id,
        businessName,
        vendorType,
        address: city,
        city,
        verified_status: false // Phase 8: Requires Admin approval
      }
    });

    const token = jwt.sign({ userId: user.id, role: 'VENDOR', vendorId: newVendor.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Application submitted successfully! Our Admin team will verify your details.', vendor: newVendor, token });

  } catch (error) {
    res.status(500).json({ message: 'Error registering vendor', error: error.message });
  }
});

/**
 * 1. GET ALL ASSIGNED OR OPEN LEADS FOR THIS VENDOR
 */
router.get('/leads', vendorMiddleware, async (req, res) => {
  try {
    // For Matchmaking: Vendors see leads assigned directly to them, OR leads with no specific vendorId (Open pool)
    const leads = await prisma.inquiry.findMany({
      where: {
        OR: [
          { vendorId: req.vendorId },
          { vendorId: null } // Open matching
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true } }, // Do not leak phone/email until bid accepted
        service: { select: { title: true } },
        venue: { select: { location: true, city: true } },
        bids: {
          where: { vendorId: req.vendorId }
        }
      }
    });

    res.json({ leads });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor leads', error: error.message });
  }
});

/**
 * 2. SUBMIT A QUOTATION BID ON A LEAD
 */
router.post('/leads/:id/bid', vendorMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { bidAmount, vendorNotes } = req.body;

    if (!bidAmount) {
      return res.status(400).json({ message: 'Bid Amount is required.' });
    }

    const inquiryId = parseInt(id);

    // Upsert Bid (Vendor can update their bid)
    let bid = await prisma.leadBid.findFirst({
      where: { inquiryId, vendorId: req.vendorId }
    });

    if (bid) {
      bid = await prisma.leadBid.update({
        where: { id: bid.id },
        data: { bidAmount, vendorNotes, status: 'PENDING' }
      });
    } else {
      bid = await prisma.leadBid.create({
        data: {
          inquiryId,
          vendorId: req.vendorId,
          bidAmount,
          vendorNotes,
          status: 'PENDING'
        }
      });
    }

    console.log(`[VENDOR BID] Vendor ${req.vendorId} submitted ₹${bidAmount} for Lead ${inquiryId}`);

    res.json({ message: 'Bid submitted successfully. The Admin will review.', bid });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting bid', error: error.message });
  }
});

module.exports = router;
