import express from "express";

import {
  getRecentActivity,
  seedDemoData,
} from "../controllers/dashboardController.js";

import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Require admin authentication for dashboard activity endpoints
router.use(verifyToken, requireRole(["admin"]));

// ===========================
// GET RECENT ACTIVITY
// ===========================
router.get(
  "/recent-activity",
  getRecentActivity
);

// ===========================
// POST SEED DEMO TRANSIT DATA
// ===========================
router.post(
  "/seed-demo",
  seedDemoData
);

export default router;