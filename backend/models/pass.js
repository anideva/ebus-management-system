import mongoose from "mongoose";

const passSchema = new mongoose.Schema(
  {
    passId: {
      type: String,
      required: true,
      unique: true,
    },

    studentName: {
      type: String,
      required: true,
    },

    studentId: {
      type: String,
      required: true,
    },

    busNumber: {
      type: String,
      required: true,
    },

    routeName: {
      type: String,
      required: true,
    },

    validFrom: {
      type: Date,
      required: true,
    },

    validUntil: {
      type: Date,
      required: true,
    },

    passType: {
      type: String,
      enum: ["Monthly", "Quarterly", "Yearly"],
      default: "Monthly",
    },

    status: {
      type: String,
      enum: ["Active", "Expired"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Pass = mongoose.model("Pass", passSchema);

export default Pass;