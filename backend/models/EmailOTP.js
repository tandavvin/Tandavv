// models/EmailOTP.js


const mongoose = require("mongoose");

const emailOtpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },

        otpHash: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        attempts: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        lastSentAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

emailOtpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("EmailOTP", emailOtpSchema);
