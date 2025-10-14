/**
 * Credit Routes
 * Defines routes for credit prediction API
 */

const express = require('express');
const { predictCreditScore } = require('../controllers/creditController');
const { apiKeyAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/predict', apiKeyAuth, predictCreditScore);

module.exports = router;
