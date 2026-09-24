const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const User =
  require("../models/User");

const seedOfficer = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected for officer seed"
    );

    const email =
      "officer@projectwatch.gov.np";

    const existing =
      await User.findOne({ email });

    if (existing) {
      existing.name =
        "ProjectWatch Field Officer";

      existing.role = "officer";
      existing.isActive = true;

      await existing.save();

      console.log(
        "✅ Existing officer updated"
      );

      process.exit(0);
    }

    const hashedPassword =
      await bcrypt.hash(
        "Officer123456",
        10
      );

    await User.create({
      name:
        "ProjectWatch Field Officer",
      email,
      password: hashedPassword,
      phone: "9810000000",
      role: "officer",
      isActive: true
    });

    console.log(
      "✅ Officer account created"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Officer seed failed:",
      error
    );

    process.exit(1);
  }
};

seedOfficer();