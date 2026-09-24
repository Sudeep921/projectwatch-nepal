const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const User =
  require("../models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected for admin seed"
    );

    const email =
      "testadmin@example.com";

    const existing =
      await User.findOne({ email });

    if (existing) {
      existing.name = "ProjectWatch Admin";
      existing.role = "admin";
      existing.isActive = true;

      await existing.save();

      console.log(
        "✅ Existing admin updated"
      );

      process.exit(0);
    }

    const hashedPassword =
      await bcrypt.hash(
        "Test123456",
        10
      );

    await User.create({
      name: "ProjectWatch Admin",
      email,
      password: hashedPassword,
      phone: "9800000000",
      role: "admin",
      isActive: true
    });

    console.log(
      "✅ Admin account created"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Admin seed failed:",
      error
    );

    process.exit(1);
  }
};

seedAdmin();