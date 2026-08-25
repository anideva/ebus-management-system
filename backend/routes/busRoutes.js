import express from "express";
import {
  getBuses,
  createBus,
  deleteBus,
} from "../controllers/busController.js";

const router = express.Router();

router.get("/", getBuses);

router.post("/", createBus);

router.delete("/:id", deleteBus);

export default router;