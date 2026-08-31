import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import busRoutes from "./routes/busRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import driverRoutes from "./routes/driverRoutes.js"

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/drivers", driverRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "E-Bus Management API is running!",
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});