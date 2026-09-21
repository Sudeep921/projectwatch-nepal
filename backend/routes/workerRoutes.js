const express = require("express");

const {
  getWorkers,
  getWorker,
  createWorker,
  updateWorker,
  deleteWorker
} = require("../controllers/workerController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getWorkers);

router.get(
  "/:id",
  authMiddleware,
  getWorker
);

router.post(
  "/",
  authMiddleware,
  createWorker
);

router.put(
  "/:id",
  authMiddleware,
  updateWorker
);

router.delete(
  "/:id",
  authMiddleware,
  deleteWorker
);

module.exports = router;