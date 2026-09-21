const Worker = require("../models/Worker");

const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: workers.length,
      workers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(
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
      worker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createWorker = async (req, res) => {
  try {
    const worker = await Worker.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      specialization: req.body.specialization,
      province: req.body.province,
      district: req.body.district,
      municipality: req.body.municipality,
      experience: req.body.experience,
      status: req.body.status || "Available",
      isVerified: req.body.isVerified || false
    });

    res.status(201).json({
      success: true,
      message: "Worker created successfully",
      worker
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
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
    res.status(400).json({
      success: false,
      message: error.message
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
      message: error.message
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