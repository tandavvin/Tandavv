// utils/rateLimit.js
//
// Tiny in-memory rate limiter (no extra dependency). Good enough for a single server instance;
// switch to a shared store (Redis) when you run several instances.

function rateLimit({ windowMs = 15 * 60 * 1000, max = 100, message = "Too many requests, please try again later." } = {}) {
  const hits = new Map(); // key -> { count, resetAt }

  // drop expired entries now and then so the Map cannot grow forever
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) if (entry.resetAt <= now) hits.delete(key);
  }, windowMs);
  sweep.unref?.();

  return (req, res, next) => {
    const key = req.ip || req.socket?.remoteAddress || "unknown";
    const now = Date.now();
    let entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, max - entry.count)));

    if (entry.count > max) {
      res.setHeader("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ success: false, message });
    }
    next();
  };
}

module.exports = { rateLimit };
