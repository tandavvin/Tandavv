// middleware/errorHandler.js

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // body-parser problems
  if (err.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request is too large" });
  }
  if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "That value is already in use" });
  }

  const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
  if (status >= 500) console.error("Unhandled error:", err);

  res.status(status).json({
    success: false,
    // client mistakes (4xx) keep their message; server faults are hidden in production
    message: status < 500 || process.env.NODE_ENV !== "production" ? err.message || "Something went wrong" : "Something went wrong",
  });
};

module.exports = { notFound, errorHandler };
