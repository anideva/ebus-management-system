import express from "express";

import {
  getPasses,
  createPass,
  updatePass,
  deletePass,
} from "../controllers/passController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ===========================
// GET ALL PASSES
// ===========================

router.get("/", verifyToken, getPasses);


// ===========================
// CREATE PASS
// ===========================

router.post("/", verifyToken, createPass);


// ===========================
// UPDATE PASS
// ===========================

router.put("/:id", verifyToken, updatePass);


// ===========================
// DELETE PASS
// ===========================

router.delete("/:id", verifyToken, deletePass);


export default router;