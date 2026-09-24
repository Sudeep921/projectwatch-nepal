const Worker = require("../models/Worker");

const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      workers
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch workers"
    });
  }
};

const getWorker = async (req, res) => {
  try {
    const worker =
      await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }

    res.json({
      success: true,
      worker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch worker"
    });
  }
};

const createWorker = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      specialization,
      province,
      district,
      municipality,
      experience,
      status,
      isVerified
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Worker name and email are required"
      });
    }

    const existing =
      await Worker.findOne({
        email: email.toLowerCase()
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Worker already exists"
      });
    }

    const worker =
      await Worker.create({
        name,
        email: email.toLowerCase(),
        phone: phone || "",
        address: address || "",
        specialization:
          specialization || "",
        province: province || "",
        district: district || "",
        municipality:
          municipality || "",
        experience:
          Number(experience || 0),
        status:
          status || "Available",
        isVerified:
          Boolean(isVerified)
      });

    res.status(201).json({
      success: true,
      message: "Worker created successfully",
      worker
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create worker"
    });
  }
};

const updateWorker = async (req, res) => {
  try {
    const worker =
      await Worker.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }

    res.json({
      success: true,
      message: "Worker updated successfully",
      worker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update worker"
    });
  }
};

const deleteWorker = async (req, res) => {
  try {
    const worker =
      await Worker.findByIdAndDelete(
        req.params.id
      );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }

    res.json({
      success: true,
      message: "Worker deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to delete worker"
    });
  }
};

module.exports = {
  getWorkers,
  getWorker,
  createWorker,
  updateWorker,
  deleteWorker
};