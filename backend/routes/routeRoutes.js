import express from "express";

import {
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../controllers/routeController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getRoutes);
router.post("/", verifyToken, createRoute);
router.put("/:id", verifyToken, updateRoute);
router.delete("/:id", verifyToken, deleteRoute);

export default router;