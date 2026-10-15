import express from "express";

import {
  getPasses,
  createPass,
  updatePass,
  deletePass,
} from "../controllers/passController.js";

import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Require admin authentication for all pass management endpoints
router.use(verifyToken, requireRole(["admin"]));

// ===========================
// GET ALL PASSES
// ===========================
router.get("/", getPasses);

// ===========================
// CREATE PASS
// ===========================
router.post("/", createPass);

// ===========================
// UPDATE PASS
// ===========================
router.put("/:id", updatePass);

// ===========================
// DELETE PASS
// ===========================
router.delete("/:id", deletePass);

export default router;