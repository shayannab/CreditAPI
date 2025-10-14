/**
 * Authentication Middleware
 * Provides optional API key authentication
 */

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    return next();
  }

  if (!apiKey) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide x-api-key header'
    });
  }

  if (apiKey !== validApiKey) {
    return res.status(403).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }

  next();
};

module.exports = {
  apiKeyAuth
};
