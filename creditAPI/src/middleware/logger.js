/**
 * Request Logging Middleware
 * Logs all incoming requests with method and URL
 */

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

module.exports = {
  logger
};
