import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
    },

    studentName: {
      type: String,
      required: true,
    },

    studentClass: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    assignedRoute: {
      type: String,
      required: true,
    },

    assignedBus: {
      type: String,
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

const Student = mongoose.model("Student", studentSchema);

export default Student;