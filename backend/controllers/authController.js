const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT
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

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required"
      });
    }

    const existingUser =
      await User.findOne({
        email: email.toLowerCase()
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Email already registered"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required"
      });
    }

    const user =
      await User.findOne({
        email: email
          .trim()
          .toLowerCase()
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "This account is inactive"
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
          "Invalid email or password"
      });
    }

    const token =
      generateToken(user);

    res.json({
      success: true,
      message:
        "Login successful",
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
async function changeEmail(req, res) {
  try {
    const {
      currentEmail,
      newEmail,
      password
    } = req.body;

    // Validate input
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

    // Clean email values
    const oldEmail =
      currentEmail
        .trim()
        .toLowerCase();

    const updatedEmail =
      newEmail
        .trim()
        .toLowerCase();

    // Check if new email is different
    if (
      oldEmail === updatedEmail
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New email must be different from current email"
      });
    }

    // Find current user
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

    // Security:
    // Make sure logged-in user
    // matches the requested account
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

    // Check password
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

    // Check if new email
    // already exists
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

    // Update email
    user.email = updatedEmail;

    await user.save();

    // Generate new token
    // because email has changed
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
  getMe,
  changeEmail
};