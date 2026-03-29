const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key';

// Middleware to verify JWT
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Mock WhatsApp Integration (Twilio/Wati)
const sendWhatsAppAlert = async (phone, customerName, eventDetails) => {
  const pkg = eventDetails?.packageType === 'COMPLETE' ? 'Complete Event Package' : 'Custom Service';
  const dateMsg = eventDetails?.date ? ` on ${eventDetails.date}` : '';
  console.log(`\n===========================================`);
  console.log(`[WHATSAPP MOCK API] Sending msg to +91 ${phone}...`);
  console.log(`Namaste ${customerName || 'Customer'}, we received your request for a ${pkg}${dateMsg}. A dedicated TWC planner from Motihari will contact you shortly!`);
  console.log(`===========================================\n`);
};

/**
 * Capture a New Lead (Inquiry)
 * POST /api/leads/capture
 * Body: { venueId, serviceId, message, eventDetails }
 */
router.post('/capture', authenticateUser, async (req, res) => {
  try {
    const { venueId, serviceId, message, eventDetails } = req.body;
    const customerId = req.user.userId;

    if (!venueId && !serviceId) {
      return res.status(400).json({ message: 'Must provide either venueId or serviceId' });
    }

    let vendorIdToAssign = null;

    // We must find the vendorId because Inquiry schema requires it
    if (venueId) {
      const venue = await prisma.venue.findUnique({ where: { id: parseInt(venueId) } });
      if (venue) vendorIdToAssign = venue.vendorId;
    } else if (serviceId) {
      const service = await prisma.service.findUnique({ where: { id: parseInt(serviceId) } });
      if (service) vendorIdToAssign = service.vendorId;
    }

    if (!vendorIdToAssign) {
      return res.status(404).json({ message: 'Underlying Vendor not found for this venue/service' });
    }

    // Create the Inquiry (Lead)
    const newLead = await prisma.inquiry.create({
      data: {
        customerId,
        vendorId: vendorIdToAssign,
        venueId: venueId ? parseInt(venueId) : null,
        serviceId: serviceId ? parseInt(serviceId) : null,
        message: message || 'Please contact me regarding pricing and availability.',
        eventDetails: eventDetails ? eventDetails : null,
        status: 'NEW'
      },
      include: {
        customer: true // needed to get phone and name for WhatsApp
      }
    });

    console.log(`[LEAD CAPTURED] Customer ${customerId} inquired about Venue/Service.`);

    // Fire automated WhatsApp Message asynchronously
    if (newLead.customer && newLead.customer.phone) {
      sendWhatsAppAlert(newLead.customer.phone, newLead.customer.name, eventDetails).catch(err => console.error("WhatsApp Mock Error:", err));
    }

    res.status(201).json({ message: 'Lead successfully captured. TWC team will contact you shortly!', leadId: newLead.id });
  } catch (error) {
    console.error('[LEAD CAPTURE ERROR]', error);
    res.status(500).json({ message: 'Error capturing lead', error: error.message });
  }
});

module.exports = router;
