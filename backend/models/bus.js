import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true,
    },

    busName: {
      type: String,
      required: true,
    },

    busType: {
      type: String,
      required: true,
    },

    driver: {
      type: String,
      required: true,
    },

    route: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    fare: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Maintenance"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Bus = mongoose.model("Bus", busSchema);

export default Bus;