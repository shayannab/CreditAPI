/**
 * Credit Controller
 * Handles credit score prediction requests
 */

const { predictCredit } = require('../utils/mlModel');

const validateInput = (data) => {
  const { income, avg_balance, on_time_payments, late_payments } = data;

  if (typeof income !== 'number' || income < 0) {
    return 'Income must be a non-negative number';
  }

  if (typeof avg_balance !== 'number' || avg_balance < 0) {
    return 'Average balance must be a non-negative number';
  }

  if (typeof on_time_payments !== 'number' || on_time_payments < 0 || !Number.isInteger(on_time_payments)) {
    return 'On-time payments must be a non-negative integer';
  }

  if (typeof late_payments !== 'number' || late_payments < 0 || !Number.isInteger(late_payments)) {
    return 'Late payments must be a non-negative integer';
  }

  return null;
};

const predictCreditScore = (req, res) => {
  try {
    const { income, avg_balance, on_time_payments, late_payments } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Request body is required'
      });
    }

    const validationError = validateInput({ income, avg_balance, on_time_payments, late_payments });
    if (validationError) {
      return res.status(400).json({
        error: 'Validation Error',
        message: validationError
      });
    }

    const result = predictCredit({ income, avg_balance, on_time_payments, late_payments });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in predictCreditScore:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing your request'
    });
  }
};

module.exports = {
  predictCreditScore
};
