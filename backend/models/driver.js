import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    driverId: {
      type: String,
      required: true,
      unique: true,
    },

    driverName: {
      type: String,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    assignedBus: {
      type: String,
      required: true,
    },

    busType: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "On Leave"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;