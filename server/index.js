const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const nseRoutes = require('./routes/nseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Cache with 30 second TTL for real-time data
const cache = new NodeCache({ stdTTL: 30 });

// Middleware
app.use(cors());
app.use(express.json());

// Make cache available to routes
app.use((req, res, next) => {
  req.cache = cache;
  next();
});

// Routes
app.use('/api', nseRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
