import express from "express";

import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../controllers/driverController.js";

import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Require admin authentication for all driver management endpoints
router.use(verifyToken, requireRole(["admin"]));

// ===========================
// GET ALL DRIVERS
// ===========================
router.get("/", getDrivers);

// ===========================
// CREATE DRIVER
// ===========================
router.post("/", createDriver);

// ===========================
// UPDATE DRIVER
// ===========================
router.put("/:id", updateDriver);

// ===========================
// DELETE DRIVER
// ===========================
router.delete("/:id", deleteDriver);

export default router;