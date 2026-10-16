import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import "./config/firebaseAdmin.js";

import busRoutes from "./routes/busRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import passRoutes from "./routes/passRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import portalRoutes from "./routes/portalRoutes.js";

if (!process.env.MONGO_URI) {
  console.error("⚠️ WARNING: MONGO_URI is not set in environment variables!");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
    });
}

const app = express();

const allowedOrigins = [
  "https://ebus-management-system.netlify.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server health checks)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/passes", passRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/portal", portalRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "E-Bus Management API is running!",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});