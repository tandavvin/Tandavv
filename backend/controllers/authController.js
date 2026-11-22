// controllers/authController.js

const EmailOTP = require("../models/EmailOTP");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const StoreConfig = require("../models/StoreConfig");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const { setAuthCookie, clearAuthCookie } = require("../utils/authCookie");

const LOGO_PATH = path.join(__dirname, "..", "public", "logo.png");
const LOGO_ATTACHMENT = {
  filename: "logo.png",
  path: LOGO_PATH,
  cid: "tandav-logo",
};

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

const hashSignupOtp = (otp) =>
  crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(String(otp))
    .digest("hex");

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  role: user.role || "user",

  // Sub Admin information
  adminTitle: user.adminTitle || "",
  permissions: user.permissions || [],
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

const verifySignupOTP = async (req, res) => {
  try {
    const { name, username, email, password, otp } = req.body || {};

    const cleanName = String(name || "").trim().slice(0, 80);
    const cleanUsername = String(username || "").trim().toLowerCase();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanOTP = String(otp || "").trim();

    if (!cleanName || !cleanUsername || !cleanEmail || !password || !cleanOTP) {
      return res.status(400).json({
        success: false,
        message: "All fields and verification code are required.",
      });
    }

    if (
      !USERNAME_RE.test(cleanUsername) ||
      !EMAIL_RE.test(cleanEmail) ||
      String(password).length < 6 ||
      !/^\d{6}$/.test(cleanOTP)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid signup details or verification code.",
      });
    }

    const otpRecord = await EmailOTP.findOne({ email: cleanEmail });

    if (!otpRecord || new Date(otpRecord.expiresAt).getTime() <= Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if ((otpRecord.attempts || 0) >= 5) {
      await EmailOTP.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    const submittedHash = hashSignupOtp(cleanOTP);
    const submittedBuf = Buffer.from(submittedHash, "hex");
    const storedBuf = Buffer.from(String(otpRecord.otpHash || ""), "hex");

    const isMatch =
      submittedBuf.length === storedBuf.length &&
      crypto.timingSafeEqual(submittedBuf, storedBuf);

    if (!isMatch) {
      otpRecord.attempts = (otpRecord.attempts || 0) + 1;

      if (otpRecord.attempts >= 5) {
        await EmailOTP.deleteOne({ _id: otpRecord._id });
        return res.status(429).json({
          success: false,
          message: "Too many incorrect attempts. Please request a new OTP.",
        });
      }

      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: "Incorrect verification code.",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existingUser) {
      await EmailOTP.deleteOne({ _id: otpRecord._id });
      return res.status(409).json({
        success: false,
        message: "Email or username is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    let user;
    try {
      user = await User.create({
        name: cleanName,
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        role: "user",
      });

      await StoreConfig.create({
        userId: user._id,
        storeName: `${cleanName}'s Store`,
        storeEmail: user.email,
      });
    } catch (creationError) {
      if (user) {
        await User.deleteOne({ _id: user._id });
      }
      throw creationError;
    }

    await EmailOTP.deleteOne({ _id: otpRecord._id });

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Email verified and account created successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Verify signup OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify your account. Please try again.",
    });
  }
};

const sendSignupOTP = async (req, res) => {
  try {
    const { name, username, email, password } = req.body || {};

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields.",
      });
    }

    const cleanName = String(name).trim().slice(0, 80);
    const cleanUsername = String(username).trim().toLowerCase();
    const cleanEmail = String(email).trim().toLowerCase();

    if (!cleanName || !USERNAME_RE.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid name and username.",
      });
    }

    if (!EMAIL_RE.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or username is already registered.",
      });
    }

    const existingOTP = await EmailOTP.findOne({ email: cleanEmail });

    if (
      existingOTP &&
      existingOTP.lastSentAt &&
      Date.now() - new Date(existingOTP.lastSentAt).getTime() < 60 * 1000
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before requesting another OTP.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = hashSignupOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    if (existingOTP) {
      existingOTP.otpHash = otpHash;
      existingOTP.expiresAt = expiresAt;
      existingOTP.attempts = 0;
      existingOTP.lastSentAt = new Date();
      await existingOTP.save();
    } else {
      await EmailOTP.create({
        email: cleanEmail,
        otpHash,
        expiresAt,
        attempts: 0,
        lastSentAt: new Date(),
      });
    }

    await sendEmail({
      to: cleanEmail,
      subject: "Verify your Tandav account",
      text: `Your Tandav verification code is ${otp}. It expires in 5 minutes.`,
      attachments: [LOGO_ATTACHMENT],
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Verify your Tandav account</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif; color:#111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
          <tr>
            <td height="5" style="height:5px; background-color:#ea580c; font-size:0; line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:24px 32px; border-bottom:1px solid #f3f4f6;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right:12px;">
                    <img
                      src="cid:tandav-logo"
                      alt="Tandav"
                      width="36"
                      height="36"
                      style="display:block; width:36px; height:36px; border:0; border-radius:8px; object-fit:contain;"
                    />
                  </td>
                  <td valign="middle">
                    <span style="font-size:18px; line-height:24px; font-weight:700; letter-spacing:1px; color:#111827; text-transform:uppercase;">
                      Tandav
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 10px; font-size:12px; line-height:18px; font-weight:700; letter-spacing:1px; color:#ea580c; text-transform:uppercase;">
                Account verification
              </p>
              <h1 style="margin:0 0 12px; font-size:24px; line-height:32px; font-weight:700; color:#111827;">
                Verify your Tandav account
              </h1>
              <p style="margin:0 0 24px; font-size:15px; line-height:24px; color:#4b5563;">
                Enter the code below to complete your registration. This code expires in <strong style="color:#111827;">5 minutes</strong>.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center" style="padding:22px 16px; background-color:#fff7ed; border:1px solid #fed7aa; border-radius:8px;">
                    <span style="font-family:'Courier New', Courier, monospace; font-size:32px; line-height:40px; font-weight:700; letter-spacing:8px; color:#ea580c;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>
              <p style="margin:0; font-size:13px; line-height:21px; color:#6b7280;">
                If you didn’t request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px; background-color:#f9fafb; border-top:1px solid #e5e7eb;">
              <p style="margin:0; font-size:12px; line-height:18px; color:#9ca3af; text-align:center;">
                &copy; ${new Date().getFullYear()} Tandav. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    });

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email.",
    });
  } catch (error) {
    console.error("Send signup OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send verification code. Please try again.",
    });
  }
};

// POST /api/auth/signup
const signupUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body || {};

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const cleanName = String(name).trim().slice(0, 80);
    const cleanUsername = String(username).trim().toLowerCase();
    const cleanEmail = String(email).trim().toLowerCase();

    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: "Please enter your name",
      });
    }

    if (!USERNAME_RE.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message:
          "Username must be 3-30 characters: lowercase letters, numbers and underscores only",
      });
    }

    if (!EMAIL_RE.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const exists = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      role: "user",
    });

    await StoreConfig.create({
      userId: user._id,
      storeName: `${cleanName}'s Store`,
      storeEmail: user.email,
    });

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not create your account",
    });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({
      email: String(email).trim().toLowerCase(),
    });

    if (
      user &&
      user.password &&
      (await bcrypt.compare(String(password), user.password))
    ) {
      const token = generateToken(user._id);
      setAuthCookie(res, token);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: publicUser(user),
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not log you in",
    });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account no longer exists",
      });
    }

    return res.status(200).json({
      success: true,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load your account",
    });
  }
};

// POST /api/auth/logout
const logoutUser = (req, res) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If this email is registered, a verification code will be sent.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    user.resetOtpHash = hashOtp(otp);
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.isResetOtpVerified = false;

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your Tandav password reset code",
      text: `Your Tandav password reset code is ${otp}. It expires in 10 minutes. If you didn't request this code, you can ignore this email.`,
      attachments: [LOGO_ATTACHMENT],
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Your Tandav password reset code</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif; color:#111827;">

  <!-- Preheader text -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    Your Tandav password reset code expires in 10 minutes.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:520px; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">

          <!-- Orange brand accent -->
          <tr>
            <td height="5" style="height:5px; background-color:#ea580c; font-size:0; line-height:0;">&nbsp;</td>
          </tr>

          <!-- Brand header -->
          <tr>
            <td style="padding:24px 32px; border-bottom:1px solid #f3f4f6;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right:12px;">
                    <img
                      src="cid:tandav-logo"
                      alt="Tandav"
                      width="36"
                      height="36"
                      style="display:block; width:36px; height:36px; border:0; border-radius:8px; object-fit:contain;"
                    />
                  </td>
                  <td valign="middle">
                    <span style="font-size:18px; line-height:24px; font-weight:700; letter-spacing:1px; color:#111827; text-transform:uppercase;">
                      Tandav
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main message -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 10px; font-size:12px; line-height:18px; font-weight:700; letter-spacing:1px; color:#ea580c; text-transform:uppercase;">
                Password reset
              </p>

              <h1 style="margin:0 0 12px; font-size:24px; line-height:32px; font-weight:700; color:#111827;">
                Your verification code
              </h1>

              <p style="margin:0 0 24px; font-size:15px; line-height:24px; color:#4b5563;">
                Enter the code below to continue resetting your Tandav password. For your security, this code expires in <strong style="color:#111827;">10 minutes</strong>.
              </p>

              <!-- Verification code -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center" style="padding:22px 16px; background-color:#fff7ed; border:1px solid #fed7aa; border-radius:8px;">
                    <span style="font-family:'Courier New', Courier, monospace; font-size:32px; line-height:40px; font-weight:700; letter-spacing:8px; color:#ea580c;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin:0; font-size:13px; line-height:21px; color:#6b7280;">
                If you didn’t request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 32px; background-color:#f9fafb; border-top:1px solid #e5e7eb;">
              <p style="margin:0; font-size:12px; line-height:18px; color:#9ca3af; text-align:center;">
                This is an automated security email. Please don’t reply.
              </p>
              <p style="margin:6px 0 0; font-size:12px; line-height:18px; color:#9ca3af; text-align:center;">
                &copy; ${new Date().getFullYear()} Tandav. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`,
    });

    return res.status(200).json({
      success: true,
      message: "If this email is registered, a verification code will be sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to process your password reset request. Please try again.",
    });
  }
};

const verifyResetCode = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const code = String(req.body.code ?? req.body.otp ?? "").trim();

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and code are required.",
      });
    }

    const user = await User.findOne({ email }).select(
      "+resetOtpHash +resetOtpExpires +isResetOtpVerified"
    );

    if (!user || !user.resetOtpHash || !user.resetOtpExpires) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired code.",
      });
    }

    const isExpired = new Date(user.resetOtpExpires).getTime() <= Date.now();
    const isMatch = user.resetOtpHash === hashOtp(code);

    if (isExpired || !isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired code.",
      });
    }

    user.isResetOtpVerified = true;
    await user.save();

    return res.status(200).json({ success: true, message: "Code verified." });
  } catch (error) {
    console.error("Verify code error:", error);
    return res.status(500).json({ success: false, message: "Server error verifying code." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { newPassword } = req.body;

    if (!email || !newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Valid email and password (at least 6 characters) are required.",
      });
    }

    const user = await User.findOne({ email }).select(
      "+resetOtpHash +resetOtpExpires +isResetOtpVerified"
    );

    if (
      !user ||
      !user.isResetOtpVerified ||
      !user.resetOtpExpires ||
      new Date(user.resetOtpExpires).getTime() <= Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Verification expired or not completed. Please start again.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(String(newPassword), salt);
    user.resetOtpHash = undefined;
    user.resetOtpExpires = undefined;
    user.isResetOtpVerified = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: "Server error resetting password." });
  }
};

module.exports = {
  signupUser,
  sendSignupOTP,
  verifySignupOTP,
  loginUser,
  getMe,
  logoutUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
};