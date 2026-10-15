import express from "express";

import {
  getBuses,
  createBus,
  deleteBus,
  updateBus,
} from "../controllers/busController.js";

import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Require admin authentication for all bus management endpoints
router.use(verifyToken, requireRole(["admin"]));

router.get("/", getBuses);
router.post("/", createBus);
router.delete("/:id", deleteBus);
router.put("/:id", updateBus);

export default router;