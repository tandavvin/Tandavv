// routes/authRoutes.js


const express = require("express");
const passport = require("passport");

const {
    sendSignupOTP,
    verifySignupOTP,
    loginUser,
    getMe,
    logoutUser,
    forgotPassword,
    verifyResetCode,
    resetPassword,
} = require("../controllers/authController");

const {
    googleAuthCallback,
    exchangeGoogleCode,
} = require("../controllers/googleAuthController");

const { verifyToken } = require("../middleware/authMiddleware");
const { rateLimit } = require("../utils/rateLimit");

const router = express.Router();

// General authentication rate limit
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: "Too many attempts. Please try again in a few minutes.",
});

// Signup OTP rate limits
const signupOtpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many OTP requests. Please try again later.",
});

const verifySignupOtpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many verification attempts. Please try again later.",
});

// Email verification and signup
router.post("/signup/send-otp", signupOtpLimiter, sendSignupOTP);
router.post("/signup/verify-otp", verifySignupOtpLimiter, verifySignupOTP);

// Email and password authentication
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

// Google authentication
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    }),
    googleAuthCallback
);

router.post("/google/exchange", authLimiter, exchangeGoogleCode);

// Get logged-in user
router.get("/me", verifyToken, getMe);

module.exports = router;
