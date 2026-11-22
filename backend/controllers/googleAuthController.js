
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const GoogleAuthCode = require("../models/GoogleAuthCode");

const { setAuthCookie } = require("../utils/authCookie");

// Step 1: Google authentication callback
const googleAuthCallback = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
            );
        }

        if (!process.env.FRONTEND_URL) {
            throw new Error("FRONTEND_URL is missing in .env");
        }

        // Generate a secure one-time authorization code
        const authCode = crypto.randomBytes(32).toString("hex");

        // Hash the code before storing it
        const codeHash = crypto
            .createHash("sha256")
            .update(authCode)
            .digest("hex");

        // Store the authorization code for 2 minutes
        await GoogleAuthCode.create({
            codeHash,
            userId: user._id,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000),
        });

        const frontendUrl = process.env.FRONTEND_URL.replace(/\/$/, "");

        return res.redirect(
            `${frontendUrl}/auth/google/callback?code=${encodeURIComponent(authCode)}`
        );

    } catch (error) {
        console.error("Google callback error:", error);

        return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
        );
    }
};


// Step 2: Exchange authorization code for JWT
const exchangeGoogleCode = async (req, res) => {
    try {
        const { code } = req.body || {};

        if (!code || typeof code !== "string") {
            return res.status(400).json({
                success: false,
                message: "Authorization code is required.",
            });
        }

        // Hash the received code
        const codeHash = crypto
            .createHash("sha256")
            .update(code)
            .digest("hex");

        // Find and delete the code atomically
        const authCode = await GoogleAuthCode.findOneAndDelete({
            codeHash,
            expiresAt: { $gt: new Date() },
        });

        if (!authCode) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired Google authorization code.",
            });
        }

        // Find the user
        const user = await User.findById(authCode.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Generate the actual login JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Store JWT in HTTP-only cookie
        setAuthCookie(res, token);

        return res.status(200).json({
            success: true,
            message: "Google login successful.",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Google code exchange error:", error);

        return res.status(500).json({
            success: false,
            message: "Google login failed.",
        });
    }
};

module.exports = {
    googleAuthCallback,
    exchangeGoogleCode,
};
