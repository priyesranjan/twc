const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: '../client' });
const handle = nextApp.getRequestHandler();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/business');
const blogRoutes = require('./routes/blog'); // Advanced SEO CMS
const adminRoutes = require('./routes/admin'); // Super Admin
const paymentRoutes = require('./routes/payment'); // Razorpay Integration
const leadsRoutes = require('./routes/leads'); // Customer Lead Generation
const vendorRoutes = require('./routes/vendor'); // Phase 3 Vendor Matchmaking
const publicRoutes = require('./routes/public'); // Phase 11 Public Directory

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/public', publicRoutes);

nextApp.prepare().then(() => {
  // Error handling middleware
  app.use((err, req, res, nextFn) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  // All other routes hand-off to Next.js Client
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[MONOLITH] Server running natively on port ${PORT}`);
  });
});
