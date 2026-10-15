import express from "express";
import {
  getAvailableServices,
  getSeatAvailability,
  bookTicket,
  getMyTickets,
  cancelTicket,
  applyPass,
  getMyPasses,
} from "../controllers/portalController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All passenger portal operations require token verification
router.use(verifyToken);

router.get("/services", getAvailableServices);
router.get("/availability", getSeatAvailability);
router.post("/book-ticket", bookTicket);
router.get("/my-tickets", getMyTickets);
router.put("/cancel-ticket/:id", cancelTicket);
router.post("/apply-pass", applyPass);
router.get("/my-passes", getMyPasses);

export default router;
