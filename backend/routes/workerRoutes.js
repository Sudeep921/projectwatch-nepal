const express = require("express");

const {
  createWorker,
  getWorkers,
  getWorker,
  updateWorker,
  deleteWorker
} = require("../controllers/workerController");

const router = express.Router();

router.post("/", createWorker);
router.get("/", getWorkers);
router.get("/:id", getWorker);
router.put("/:id", updateWorker);
router.delete("/:id", deleteWorker);

module.exports = router;