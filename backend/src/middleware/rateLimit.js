const rateLimit = require("express-rate-limit");

function parsePositiveInt(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
}

function createRateLimiter({ windowMs, max, message, skipSuccessfulRequests = false, skip }) {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    skip,
  });
}

const apiLimiter = createRateLimiter({
  windowMs: parsePositiveInt(process.env.API_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  max: parsePositiveInt(process.env.API_RATE_LIMIT_MAX, 300),
  message: "Too many requests. Please try again shortly.",
  skip: (req) => req.path === "/health",
});

const authLoginLimiter = createRateLimiter({
  windowMs: parsePositiveInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  max: parsePositiveInt(process.env.AUTH_RATE_LIMIT_MAX, 10),
  message: "Too many login attempts. Please try again in a few minutes.",
  skipSuccessfulRequests: true,
});

const contactLimiter = createRateLimiter({
  windowMs: parsePositiveInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  max: parsePositiveInt(process.env.CONTACT_RATE_LIMIT_MAX, 6),
  message: "Too many contact requests. Please try again later.",
});

module.exports = {
  apiLimiter,
  authLoginLimiter,
  contactLimiter,
};