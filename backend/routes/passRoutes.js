import express from "express";

import {
  getPasses,
  createPass,
  updatePass,
  deletePass,
} from "../controllers/passController.js";

const router = express.Router();

router.get("/", getPasses);

router.post("/", createPass);

router.put("/:id", updatePass);

router.delete("/:id", deletePass);

export default router;