const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// ========================================
// GENERATE JWT
// ========================================

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
}

// ========================================
// EMAIL TRANSPORTER
// ========================================

const mailTransporter =
  nodemailer.createTransport({
    host:
      process.env.MAIL_HOST ||
      "smtp.gmail.com",

    port:
      Number(
        process.env.MAIL_PORT || 587
      ),

    secure: false,

    auth: {
      user:
        process.env.MAIL_USER,

      pass:
        process.env.MAIL_PASSWORD
    }
  });

// ========================================
// GENERATE OTP
// ========================================

function generateOTP() {
  return Math.floor(
    100000 +
    Math.random() * 900000
  ).toString();
}

// ========================================
// HASH OTP
// ========================================

async function hashOTP(otp) {
  return bcrypt.hash(
    otp,
    10
  );
}

// ========================================
// SEND EMAIL
// ========================================

async function sendOTPEmail(
  email,
  otp,
  subject,
  message
) {
  await mailTransporter.sendMail({
    from:
      process.env.MAIL_FROM ||
      process.env.MAIL_USER,

    to: email,

    subject,

    text:
      `${message}\n\n` +
      `Your verification code is: ${otp}\n\n` +
      `This code will expire in 10 minutes.\n\n` +
      `ProjectWatch Nepal`
  });
}

// ===============================
// REGISTER
// ===============================

async function register(req, res) {
  try {
    const {
      name,
      email,
      phone,
      password,
      role
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required"
      });
    }

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const existingUser =
      await User.findOne({
        email: cleanEmail
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Email already registered"
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        name,
        email: cleanEmail,
        phone: phone || "",
        password: hashedPassword,
        role: role || "citizen"
      });

    const token =
      generateToken(user);

    res.status(201).json({
      success: true,

      message:
        "Registration successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {

    console.error(
      "Register error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error during registration"
    });
  }
}

// ===============================
// LOGIN
// ===============================

async function login(req, res) {
  try {

    const {
      email,
      password
    } = req.body;

    if (!email && !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required"
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required"
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message:
          "Password is required"
      });
    }

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const user =
      await User.findOne({
        email: cleanEmail
      });

    // --------------------------------
    // BOTH WRONG
    // --------------------------------

    if (!user) {

      return res.status(401).json({
        success: false,
        message:
          "Email and password are incorrect"
      });
    }

    // --------------------------------
    // ACCOUNT INACTIVE
    // --------------------------------

    if (!user.isActive) {

      return res.status(403).json({
        success: false,
        message:
          "This account is inactive"
      });
    }

    // --------------------------------
    // PASSWORD CHECK
    // --------------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {

      return res.status(401).json({
        success: false,
        message:
          "Password is incorrect"
      });
    }

    // --------------------------------
    // ONLY ADMIN / OFFICER
    // --------------------------------

    if (
      user.role !== "admin" &&
      user.role !== "officer"
    ) {

      return res.status(403).json({
        success: false,
        message:
          "Admin or officer access required"
      });
    }

    // --------------------------------
    // GENERATE LOGIN OTP
    // --------------------------------

    const otp =
      generateOTP();

    const otpHash =
      await hashOTP(otp);

    user.loginOTPHash =
      otpHash;

    user.loginOTPExpires =
      new Date(
        Date.now() +
        10 * 60 * 1000
      );

    await user.save();

    // --------------------------------
    // SEND OTP
    // --------------------------------

    try {

      await sendOTPEmail(
        user.email,
        otp,
        "ProjectWatch Nepal - Login Verification Code",
        "Use this code to complete your admin login."
      );

    } catch (mailError) {

      console.error(
        "LOGIN OTP EMAIL ERROR:",
        mailError
      );

      user.loginOTPHash = "";
      user.loginOTPExpires = null;

      await user.save();

      return res.status(500).json({
        success: false,
        message:
          "Unable to send verification code. Please check email configuration."
      });
    }

    // --------------------------------
    // RETURN OTP REQUIRED
    // --------------------------------

    res.json({
      success: true,

      requires2FA: true,

      message:
        "Verification code sent to your email",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error during login"
    });
  }
}

// ===============================
// VERIFY LOGIN OTP
// ===============================

async function verifyLoginOTP(
  req,
  res
) {

  try {

    const {
      email,
      otp
    } = req.body;

    if (!email || !otp) {

      return res.status(400).json({
        success: false,
        message:
          "Email and verification code are required"
      });
    }

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const user =
      await User.findOne({
        email: cleanEmail
      });

    if (!user) {

      return res.status(401).json({
        success: false,
        message:
          "Invalid verification request"
      });
    }

    if (
      !user.loginOTPHash ||
      !user.loginOTPExpires
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Verification code has expired. Please login again."
      });
    }

    if (
      new Date() >
      user.loginOTPExpires
    ) {

      user.loginOTPHash = "";
      user.loginOTPExpires = null;

      await user.save();

      return res.status(400).json({
        success: false,
        message:
          "Verification code has expired. Please login again."
      });
    }

    const otpMatch =
      await bcrypt.compare(
        String(otp),
        user.loginOTPHash
      );

    if (!otpMatch) {

      return res.status(401).json({
        success: false,
        message:
          "Invalid verification code"
      });
    }

    // --------------------------------
    // CLEAR OTP
    // --------------------------------

    user.loginOTPHash = "";
    user.loginOTPExpires = null;

    await user.save();

    // --------------------------------
    // FINAL TOKEN
    // --------------------------------

    const token =
      generateToken(user);

    res.json({
      success: true,

      message:
        "Two-factor verification successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {

    console.error(
      "Verify login OTP error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error during verification"
    });
  }
}

// ===============================
// FORGOT PASSWORD
// ===============================

async function forgotPassword(
  req,
  res
) {

  try {

    const {
      email
    } = req.body;

    if (!email) {

      return res.status(400).json({
        success: false,
        message:
          "Email is required"
      });
    }

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const user =
      await User.findOne({
        email: cleanEmail
      });

    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "Email is incorrect"
      });
    }

    if (
      user.role !== "admin" &&
      user.role !== "officer"
    ) {

      return res.status(403).json({
        success: false,
        message:
          "Password reset is available only for admin and officer accounts"
      });
    }

    const otp =
      generateOTP();

    const otpHash =
      await hashOTP(otp);

    user.resetOTPHash =
      otpHash;

    user.resetOTPExpires =
      new Date(
        Date.now() +
        10 * 60 * 1000
      );

    await user.save();

    try {

      await sendOTPEmail(
        user.email,
        otp,
        "ProjectWatch Nepal - Password Reset Code",
        "Use this code to reset your ProjectWatch Nepal password."
      );

    } catch (mailError) {

      console.error(
        "PASSWORD RESET EMAIL ERROR:",
        mailError
      );

      user.resetOTPHash = "";
      user.resetOTPExpires = null;

      await user.save();

      return res.status(500).json({
        success: false,
        message:
          "Unable to send password reset code"
      });
    }

    res.json({
      success: true,
      message:
        "Password reset code sent to your email"
    });

  } catch (error) {

    console.error(
      "Forgot password error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error during password reset"
    });
  }
}

// ===============================
// RESET PASSWORD
// ===============================

async function resetPassword(
  req,
  res
) {

  try {

    const {
      email,
      otp,
      newPassword
    } = req.body;

    if (
      !email ||
      !otp ||
      !newPassword
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Email, verification code and new password are required"
      });
    }

    if (
      newPassword.length < 6
    ) {

      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters"
      });
    }

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const user =
      await User.findOne({
        email: cleanEmail
      });

    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "Email is incorrect"
      });
    }

    if (
      !user.resetOTPHash ||
      !user.resetOTPExpires
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Password reset code has expired. Please request a new code."
      });
    }

    if (
      new Date() >
      user.resetOTPExpires
    ) {

      user.resetOTPHash = "";
      user.resetOTPExpires = null;

      await user.save();

      return res.status(400).json({
        success: false,
        message:
          "Password reset code has expired. Please request a new code."
      });
    }

    const otpMatch =
      await bcrypt.compare(
        String(otp),
        user.resetOTPHash
      );

    if (!otpMatch) {

      return res.status(401).json({
        success: false,
        message:
          "Invalid verification code"
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    user.resetOTPHash = "";
    user.resetOTPExpires = null;

    await user.save();

    res.json({
      success: true,
      message:
        "Password changed successfully"
    });

  } catch (error) {

    console.error(
      "Reset password error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while resetting password"
    });
  }
}

// ===============================
// GET CURRENT USER
// ===============================

async function getMe(req, res) {

  try {

    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {

    console.error(
      "Get user error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error"
    });
  }
}

// ===============================
// CHANGE EMAIL
// ===============================

async function changeEmail(
  req,
  res
) {

  try {

    const {
      currentEmail,
      newEmail,
      password
    } = req.body;

    if (
      !currentEmail ||
      !newEmail ||
      !password
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Current email, new email and password are required"
      });
    }

    const oldEmail =
      currentEmail
        .trim()
        .toLowerCase();

    const updatedEmail =
      newEmail
        .trim()
        .toLowerCase();

    if (
      oldEmail === updatedEmail
    ) {

      return res.status(400).json({
        success: false,
        message:
          "New email must be different from current email"
      });
    }

    const user =
      await User.findOne({
        email: oldEmail
      });

    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "Current email not found"
      });
    }

    if (
      user._id.toString() !==
      req.user.id.toString()
    ) {

      return res.status(403).json({
        success: false,
        message:
          "You can only change your own email"
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {

      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect"
      });
    }

    const emailExists =
      await User.findOne({
        email: updatedEmail,
        _id: {
          $ne: user._id
        }
      });

    if (emailExists) {

      return res.status(409).json({
        success: false,
        message:
          "New email is already registered"
      });
    }

    user.email =
      updatedEmail;

    await user.save();

    const newToken =
      generateToken(user);

    res.json({
      success: true,

      message:
        "Email changed successfully",

      token: newToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {

    console.error(
      "Change email error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while changing email"
    });
  }
}

// ===============================
// EXPORTS
// ===============================

module.exports = {
  register,
  login,
  verifyLoginOTP,
  forgotPassword,
  resetPassword,
  getMe,
  changeEmail
};