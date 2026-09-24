const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Project =
  require("../models/Project");

const projects = [
  {
    name:
      "Kathmandu Ring Road Expansion",
    projectCode:
      "PW-BAG-00124",
    province: "Bagmati",
    district: "Kathmandu",
    municipality:
      "Kathmandu Metropolitan City",
    budget: 8400000000,
    progress: 42,
    status: "Critical",
    riskLevel: "Critical",
    contractor:
      "Nepal Infrastructure Development JV",
    description:
      "Expansion and upgrading of Kathmandu Ring Road infrastructure.",
    startDate:
      new Date("2024-01-15"),
    expectedEndDate:
      new Date("2027-12-30"),
    latitude: 27.7000,
    longitude: 85.3200,
    location:
      "Kathmandu, Bagmati Province",
    isPublic: true
  },

  {
    name:
      "Pokhara Regional Bridge",
    projectCode:
      "PW-GAN-00087",
    province: "Gandaki",
    district: "Kaski",
    municipality:
      "Pokhara Metropolitan City",
    budget: 3800000000,
    progress: 38,
    status: "Delayed",
    riskLevel: "High",
    contractor:
      "Himalayan Bridge Construction",
    description:
      "Regional bridge development project in Pokhara.",
    startDate:
      new Date("2024-03-01"),
    expectedEndDate:
      new Date("2027-06-30"),
    latitude: 28.2096,
    longitude: 83.9856,
    location:
      "Pokhara, Gandaki Province",
    isPublic: true
  },

  {
    name:
      "District Hospital Upgrade",
    projectCode:
      "PW-KOS-00211",
    province: "Koshi",
    district: "Morang",
    municipality:
      "Biratnagar Metropolitan City",
    budget: 2100000000,
    progress: 56,
    status: "Active",
    riskLevel: "Medium",
    contractor:
      "Eastern Health Infrastructure Pvt. Ltd.",
    description:
      "Upgrade and modernization of district hospital facilities.",
    startDate:
      new Date("2024-06-10"),
    expectedEndDate:
      new Date("2027-01-15"),
    latitude: 26.4525,
    longitude: 87.2718,
    location:
      "Biratnagar, Koshi Province",
    isPublic: true
  },

  {
    name:
      "Butwal-Bhairahawa Road",
    projectCode:
      "PW-LUM-00178",
    province: "Lumbini",
    district: "Rupandehi",
    municipality:
      "Butwal Sub-Metropolitan City",
    budget: 5600000000,
    progress: 74,
    status: "Active",
    riskLevel: "Low",
    contractor:
      "Lumbini Highway JV",
    description:
      "Road improvement and expansion between Butwal and Bhairahawa.",
    startDate:
      new Date("2023-08-01"),
    expectedEndDate:
      new Date("2026-12-30"),
    latitude: 27.7000,
    longitude: 83.4500,
    location:
      "Butwal, Lumbini Province",
    isPublic: true
  },

  {
    name:
      "Terai Irrigation Network",
    projectCode:
      "PW-MAD-00321",
    province: "Madhesh",
    district: "Dhanusha",
    municipality:
      "Janakpurdham Sub-Metropolitan City",
    budget: 4200000000,
    progress: 29,
    status: "Delayed",
    riskLevel: "High",
    contractor:
      "Terai Water Infrastructure JV",
    description:
      "Large-scale irrigation network for agricultural areas.",
    startDate:
      new Date("2024-02-20"),
    expectedEndDate:
      new Date("2028-02-20"),
    latitude: 26.7288,
    longitude: 85.9263,
    location:
      "Janakpur, Madhesh Province",
    isPublic: true
  },

  {
    name:
      "Karnali District Hospital",
    projectCode:
      "PW-KAR-00109",
    province: "Karnali",
    district: "Surkhet",
    municipality:
      "Birendranagar Municipality",
    budget: 1700000000,
    progress: 91,
    status: "Completed",
    riskLevel: "Low",
    contractor:
      "Karnali Health Construction",
    description:
      "Construction and completion of district hospital infrastructure.",
    startDate:
      new Date("2022-04-01"),
    expectedEndDate:
      new Date("2026-06-30"),
    latitude: 28.6000,
    longitude: 81.6330,
    location:
      "Surkhet, Karnali Province",
    isPublic: true
  },

  {
    name:
      "Mahakali Drinking Water Project",
    projectCode:
      "PW-SUD-00214",
    province:
      "Sudurpashchim",
    district: "Kanchanpur",
    municipality:
      "Bhimdatta Municipality",
    budget: 980000000,
    progress: 63,
    status: "Active",
    riskLevel: "Medium",
    contractor:
      "Mahakali Water Development JV",
    description:
      "Drinking water infrastructure development for local communities.",
    startDate:
      new Date("2024-05-10"),
    expectedEndDate:
      new Date("2027-05-30"),
    latitude: 28.8400,
    longitude: 80.3200,
    location:
      "Kanchanpur, Sudurpashchim Province",
    isPublic: true
  },

  {
    name:
      "Community School Reconstruction",
    projectCode:
      "PW-BAG-00345",
    province: "Bagmati",
    district: "Lalitpur",
    municipality:
      "Lalitpur Metropolitan City",
    budget: 1200000000,
    progress: 81,
    status: "Active",
    riskLevel: "Low",
    contractor:
      "Community Infrastructure Nepal",
    description:
      "Reconstruction and improvement of community school buildings.",
    startDate:
      new Date("2024-08-01"),
    expectedEndDate:
      new Date("2027-03-30"),
    latitude: 27.6588,
    longitude: 85.3247,
    location:
      "Lalitpur, Bagmati Province",
    isPublic: true
  }
];

const seedProjects = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected for project seed"
    );

    await Project.deleteMany({});

    await Project.insertMany(
      projects
    );

    console.log(
      `✅ ${projects.length} projects inserted`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Project seed failed:",
      error
    );

    process.exit(1);
  }
};

seedProjects();