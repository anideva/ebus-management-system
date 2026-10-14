import express from "express";

import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ===========================
// GET ALL PAYMENTS
// ===========================

router.get("/", verifyToken, getPayments);


// ===========================
// CREATE PAYMENT
// ===========================

router.post("/", verifyToken, createPayment);


// ===========================
// UPDATE PAYMENT
// ===========================

router.put("/:id", verifyToken, updatePayment);


// ===========================
// DELETE PAYMENT
// ===========================

router.delete("/:id", verifyToken, deletePayment);


export default router;