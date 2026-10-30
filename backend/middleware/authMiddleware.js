import admin from "../config/firebaseAdmin.js";
import User from "../models/user.js";

/**
 * Verify Firebase ID Token and resolve or provision user role in MongoDB.
 */
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No authentication token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);

    // Parse configured admin emails from environment variable
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    // Automatically recognize demo admin account for presentations
    if (!adminEmails.includes("admin.demo@ebus.com")) {
      adminEmails.push("admin.demo@ebus.com");
    }

    const userEmail = (decodedToken.email || "").toLowerCase();
    const isConfiguredAdmin = userEmail && adminEmails.includes(userEmail);

    let role = "passenger";
    let userDoc = null;

    try {
      userDoc = await User.findOne({ firebaseUid: decodedToken.uid });

      if (!userDoc) {
        // Public registration assigns 'passenger' by default.
        // Only explicitly configured ADMIN_EMAILS accounts receive the admin role.
        // Client-supplied roles or registration parameters are never accepted.
        const initialRole = isConfiguredAdmin ? "admin" : "passenger";

        userDoc = await User.create({
          firebaseUid: decodedToken.uid,
          email: userEmail,
          displayName: decodedToken.name || "",
          role: initialRole,
        });
        role = userDoc.role;
      } else {
        let needsSave = false;
        // Promote to admin if specified in ADMIN_EMAILS
        if (isConfiguredAdmin && userDoc.role !== "admin") {
          userDoc.role = "admin";
          needsSave = true;
        }
        if (decodedToken.name && userDoc.displayName !== decodedToken.name) {
          userDoc.displayName = decodedToken.name;
          needsSave = true;
        }
        if (userEmail && userDoc.email !== userEmail) {
          userDoc.email = userEmail;
          needsSave = true;
        }
        if (needsSave) {
          await userDoc.save();
        }
        role = userDoc.role;
      }
    } catch (dbError) {
      console.warn("User role lookup in DB failed, using fallback:", dbError.message);
      role = isConfiguredAdmin ? "admin" : "passenger";
    }

    req.user = {
      ...decodedToken,
      role,
      dbUser: userDoc,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      message: "Unauthorized. Invalid or expired token.",
    });
  }
};

/**
 * Middleware to restrict route access to specific roles (e.g. ['admin']).
 */
export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized. Authentication required.",
      });
    }

    const currentRole = req.user.role || "passenger";
    if (!allowedRoles.includes(currentRole)) {
      return res.status(403).json({
        message: `Forbidden. Access denied for role '${currentRole}'. Required: [${allowedRoles.join(
          ", "
        )}].`,
      });
    }

    next();
  };
};

export default verifyToken;