import express from "express";

import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../controllers/driverController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ===========================
// GET ALL DRIVERS
// ===========================

router.get("/", verifyToken, getDrivers);


// ===========================
// CREATE DRIVER
// ===========================

router.post("/", verifyToken, createDriver);


// ===========================
// UPDATE DRIVER
// ===========================

router.put("/:id", verifyToken, updateDriver);


// ===========================
// DELETE DRIVER
// ===========================

router.delete("/:id", verifyToken, deleteDriver);


export default router;