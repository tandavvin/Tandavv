// app.js
// Builds the Express app (no database connection, no listening)

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const passport = require("passport");
const teamRoutes = require("./routes/teamRoutes");
const cookieParser = require("cookie-parser");
const adminProductRoutes = require("./routes/adminProductRoutes");

// Load environment variables first
dotenv.config({ quiet: true });

// Register Google authentication strategy
require("./config/passport");

const configRoutes = require("./routes/configRoutes");
const authRoutes = require("./routes/authRoutes");
const publicRoutes = require("./routes/publicRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const { UPLOAD_ROOT } = require("./controllers/uploadController");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// ---------- Passport initialization ----------
app.use(passport.initialize());

// ---------- Trust proxy ----------
if (process.env.TRUST_PROXY) {
    app.set("trust proxy", Number(process.env.TRUST_PROXY) || 1);
}

// ---------- Security headers ----------
app.disable("x-powered-by");

app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
});

// ---------- CORS ----------
const allowedOrigins = (
    process.env.CLIENT_URL ||
    "http://localhost:5173,http://127.0.0.1:5173"
)
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            const error = new Error(
                `Origin ${origin} is not allowed by CORS`
            );

            error.status = 403;
            return callback(error);
        },
        credentials: true,
    })
);

// ---------- Request cookies ----------
app.use(cookieParser());

// ... your other routes
app.use("/api/team", teamRoutes);

// ---------- Uploaded images ----------
fs.mkdirSync(UPLOAD_ROOT, { recursive: true });

app.use(
    "/uploads",
    express.static(UPLOAD_ROOT, {
        maxAge: "7d",
        index: false,
        setHeaders(res) {
            res.setHeader(
                "Cross-Origin-Resource-Policy",
                "cross-origin"
            );
        },
    })
);

// Upload routes must be mounted BEFORE express.json
app.use("/api/upload", uploadRoutes);

// ---------- Request body parser ----------
app.use(express.json({ limit: "2mb" }));

// ---------- API routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/config", configRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/products", adminProductRoutes);

// ---------- Health checks ----------
app.get("/", (req, res) => {
    res.send("Tandav Multi-Tenant SaaS API is running...");
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "ok",
        time: new Date().toISOString(),
    });
});

// ---------- Error handling ----------
app.use(notFound);
app.use(errorHandler);

module.exports = app;