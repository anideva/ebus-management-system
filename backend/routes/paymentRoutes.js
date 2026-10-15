import express from "express";

import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";

import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Require admin authentication for all payment management endpoints
router.use(verifyToken, requireRole(["admin"]));

// ===========================
// GET ALL PAYMENTS
// ===========================
router.get("/", getPayments);

// ===========================
// CREATE PAYMENT
// ===========================
router.post("/", createPayment);

// ===========================
// UPDATE PAYMENT
// ===========================
router.put("/:id", updatePayment);

// ===========================
// DELETE PAYMENT
// ===========================
router.delete("/:id", deletePayment);

export default router;