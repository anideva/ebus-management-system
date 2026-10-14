import express from "express";

import {
  getBuses,
  createBus,
  deleteBus,
  updateBus,
} from "../controllers/busController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getBuses);

router.post("/", verifyToken, createBus);

router.delete("/:id", verifyToken, deleteBus);

router.put("/:id", verifyToken, updateBus);

export default router;