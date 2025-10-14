/**
 * FinPilot Credit Predictor API
 * Main server file
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { logger } = require('./middleware/logger');
const creditRoutes = require('./routes/creditRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({
    message: 'FinPilot Credit Predictor API',
    version: '1.0.0',
    endpoints: {
      predict: 'POST /credit/predict'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/credit', creditRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`FinPilot Credit Predictor API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Key Auth: ${process.env.API_KEY ? 'Enabled' : 'Disabled'}`);
});

module.exports = app;
