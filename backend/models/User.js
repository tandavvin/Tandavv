// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
        },

        googleId: {
            type: String,
        },

        // Tandav platform roles
        role: {
            type: String,
            enum: ["superadmin", "subadmin", "user"],
            default: "user",
        },

        // User account status
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },

        // Sub Admin permissions
        permissions: {
            type: [String],
            default: [],
        },

        // Sub Admin designation
        adminTitle: {
            type: String,
            trim: true,
            default: "",
        },

        // Password Reset OTP
        resetOtpHash: {
            type: String,
            select: false,
        },

        resetOtpExpires: {
            type: Date,
            select: false,
        },

        isResetOtpVerified: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
