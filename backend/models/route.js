import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    routeId: {
      type: String,
      required: true,
      unique: true,
    },

    routeName: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    stops: {
      type: [String],
      required: true,
    },

    distance: {
      type: Number,
      required: true,
    },

    estimatedTime: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Route = mongoose.model("Route", routeSchema);

export default Route;