const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key';

// Dummy Middleware for Auth (In prod, use a separate file)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Dummy Middleware for optional Auth (Gated Pricing)
const optionalAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) { }
  }
  next();
};

// Advanced Rate Limiting Memory Store
const inquiryRateStore = new Map();
const windowMs = 5 * 60 * 1000; // 5 minutes
const maxLeads = 10; // Pen-test protection (Role #29)

const inquiryRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const userData = inquiryRateStore.get(ip) || { count: 0, startTime: now };
  
  if (now - userData.startTime > windowMs) {
    userData.count = 0;
    userData.startTime = now;
  }
  
  userData.count += 1;
  inquiryRateStore.set(ip, userData);
  
  if (userData.count > maxLeads) {
    return res.status(429).json({ message: 'Too many inquiries submitted from this IP, please try again after 5 minutes.' });
  }
  next();
};

/**
 * 1. GET ALL CATEGORIES
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

/**
 * 2. SEARCH & LIST SERVICES
 */
router.get('/services', async (req, res) => {
  try {
    const { city, categoryId, minPrice, maxPrice } = req.query;
    const filter = {};
    if (city) filter.city = city;
    if (categoryId) filter.categoryId = parseInt(categoryId);
    if (minPrice || maxPrice) {
       filter.price = {
         ...(minPrice && { gte: parseFloat(minPrice) }),
         ...(maxPrice && { lte: parseFloat(maxPrice) }),
       };
    }

    const services = await prisma.service.findMany({
      where: filter,
      include: {
        vendor: { select: { businessName: true, verified_status: true } },
        category: true
      }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

/**
 * 3. SEARCH & LIST VENUES
 */
router.get('/venues', optionalAuthMiddleware, async (req, res) => {
  try {
    const { city, minCapacity, minPrice, maxPrice } = req.query;
    const filter = {};
    if (city) filter.city = city;
    if (minCapacity) filter.capacity = { gte: parseInt(minCapacity) };
    if (minPrice || maxPrice) {
       filter.pricePerPlate = {
         ...(minPrice && { gte: parseFloat(minPrice) }),
         ...(maxPrice && { lte: parseFloat(maxPrice) }),
       };
    }

    const venues = await prisma.venue.findMany({
      where: filter,
      include: {
        vendor: { select: { businessName: true, verified_status: true } }
      }
    });
    let venuesData = venues;
    // IF NOT AUTHENTICATED, MASK THE PRICING (Price Wall Feature)
    if (!req.user) {
      venuesData = venues.map(v => ({
        ...v,
        pricePerPlate: "LOCKED_LOGIN_REQUIRED"
      }));
    }

    res.json(venuesData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching venues', error: error.message });
  }
});

/**
 * 4. LEAD GENERATION (Submit Inquiry)
 * This is arguably the most important endpoint for the marketplace.
 * Protected by Rate Limiter & Auth.
 */
router.post('/inquiries', authMiddleware, inquiryRateLimiter, async (req, res) => {
  try {
    const { vendorId, serviceId, venueId, message } = req.body;
    const customerId = req.user.userId;

    if (!vendorId) return res.status(400).json({ message: 'Vendor ID is required' });

    // Defensive Data Sanitization (Role #27)
    const sanitizedMessage = typeof message === 'string' 
      ? message.replace(/<[^>]*>?/gm, '').trim() // Strip basic HTML tags
      : '';

    const inquiry = await prisma.inquiry.create({
      data: {
        customerId,
        vendorId,
        serviceId: serviceId || null,
        venueId: venueId || null,
        message: sanitizedMessage,
        status: 'NEW'
      }
    });

    // In a real system, you would trigger SMS/Email notifications to the Vendor here.
    console.log(`[LEAD GENERATED] Vendor ${vendorId} received lead from User ${customerId}`);

    res.status(201).json({ message: 'Inquiry sent successfully', inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error generating lead', error: error.message });
  }
});

/**
 * 5. BOOK GUIDED VENUE TOUR
 */
router.post('/tours', authMiddleware, async (req, res) => {
  try {
    const { venueId, visitDate } = req.body;
    const customerId = req.user.userId;

    if (!venueId || !visitDate) return res.status(400).json({ message: 'Venue ID and Visit Date are required' });

    const visit = await prisma.siteVisit.create({
      data: {
        customerId,
        venueId,
        visitDate: new Date(visitDate),
        status: 'SCHEDULED'
      }
    });

    res.status(201).json({ message: 'Guided Tour booked successfully', visit });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling tour', error: error.message });
  }
});

module.exports = router;
