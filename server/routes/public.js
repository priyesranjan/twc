const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * 1. GET ALL VERIFIED VENDORS (Agency Guarded)
 * Returns a list of properties/vendors but heavily redacts contact info
 */
router.get('/vendors', async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { verified_status: true },
      select: {
        id: true,
        businessName: true,
        vendorType: true,
        city: true,
        description: true,
        // STRICTLY NO PHONE OR EMAIL RETURNED!
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public directory', error: error.message });
  }
});

/**
 * 2. GET SINGLE VENDOR PROFILE (Agency Guarded)
 */
router.get('/vendors/:id', async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        businessName: true,
        vendorType: true,
        address: true,
        city: true,
        description: true,
        services: { select: { title: true, price: true } },
        venues: { select: { venueType: true, pricePerPlate: true, capacity: true } }
        // STRICTLY NO PHONE OR EMAIL
      }
    });

    if (!vendor || !vendor.verified_status) {
      // Re-fetch verifying status because select doesn't fetch verified_status
      const vCheck = await prisma.vendor.findUnique({ where: { id: parseInt(req.params.id) } });
      if (!vCheck || !vCheck.verified_status) return res.status(404).json({ message: 'Vendor not found or not verified.' });
    }

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor profile', error: error.message });
  }
});

module.exports = router;
