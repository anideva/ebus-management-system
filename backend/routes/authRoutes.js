import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/auth/me
 * Returns current authenticated user profile and assigned role.
 */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const role = req.user.role || "passenger";
    const displayName =
      req.user.name ||
      req.user.displayName ||
      req.user.dbUser?.displayName ||
      "";

    res.json({
      uid: req.user.uid,
      email: req.user.email || "",
      displayName,
      role,
    });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ message: "Failed to retrieve user profile" });
  }
});

export default router;
