import express from "express";
import {
  getBuses,
  createBus,
  deleteBus,
  updateBus,
} from "../controllers/busController.js";

const router = express.Router();

router.get("/", getBuses);

router.post("/", createBus);

router.delete("/:id", deleteBus);

router.put("/:id", updateBus);

export default router;