import express from "express";

import {
  getRecentActivity,
} from "../controllers/dashboardController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ===========================
// GET RECENT ACTIVITY
// ===========================

router.get(
  "/recent-activity",
  verifyToken,
  getRecentActivity
);

export default router;