const express = require("express");

const {
  getWorkers,
  getWorker,
  createWorker,
  updateWorker,
  deleteWorker
} = require("../controllers/workerController");

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getWorkers
);

router.get(
  "/:id",
  authMiddleware,
  getWorker
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createWorker
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateWorker
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteWorker
);

module.exports = router;