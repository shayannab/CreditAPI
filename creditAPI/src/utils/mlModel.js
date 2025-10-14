/**
 * ML Model Utility for Credit Score Prediction
 * Implements a simple predictive formula for MVP credit scoring
 */

/**
 * Clamps a value between minimum and maximum bounds
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Clamped value
 */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * Calculates credit score based on financial data
 * Formula: 300 + (income/1000) + (avg_balance/500) + (on_time_payments * 5) - (late_payments * 15)
 * Score is clamped between 300 and 850
 *
 * @param {Object} data - Financial data object
 * @param {number} data.income - Annual income
 * @param {number} data.avg_balance - Average account balance
 * @param {number} data.on_time_payments - Number of on-time payments
 * @param {number} data.late_payments - Number of late payments
 * @returns {Object} Object containing predicted score and breakdown
 */
const calculateCreditScore = ({ income, avg_balance, on_time_payments, late_payments }) => {
  const incomeContrib = income / 1000;
  const balanceContrib = avg_balance / 500;
  const onTimeContrib = on_time_payments * 5;
  const latePenalty = late_payments * 15;

  const rawScore = 300 + incomeContrib + balanceContrib + onTimeContrib - latePenalty;
  const predictedScore = Math.round(clamp(rawScore, 300, 850));

  return {
    predictedScore,
    breakdown: {
      income_contrib: Math.round(incomeContrib),
      balance_contrib: Math.round(balanceContrib),
      on_time_contrib: Math.round(onTimeContrib),
      late_penalty: Math.round(latePenalty)
    }
  };
};

/**
 * Generates personalized advice based on payment history
 * @param {number} late_payments - Number of late payments
 * @returns {string} Personalized advice message
 */
const generateAdvice = (late_payments) => {
  if (late_payments > 2) {
    return "Reduce late payments to improve your score.";
  }
  return "Keep paying on time to maintain growth.";
};

/**
 * Main prediction function that combines score calculation and advice generation
 * @param {Object} inputData - Financial data object
 * @param {number} inputData.income - Annual income
 * @param {number} inputData.avg_balance - Average account balance
 * @param {number} inputData.on_time_payments - Number of on-time payments
 * @param {number} inputData.late_payments - Number of late payments
 * @returns {Object} Complete prediction with score, breakdown, and advice
 */
const predictCredit = (inputData) => {
  const { predictedScore, breakdown } = calculateCreditScore(inputData);
  const advice = generateAdvice(inputData.late_payments);

  return {
    predicted_score: predictedScore,
    breakdown,
    advice
  };
};

module.exports = {
  predictCredit,
  calculateCreditScore,
  generateAdvice
};
