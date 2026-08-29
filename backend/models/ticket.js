import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },

    passengerName: {
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

    journeyDate: {
      type: String,
      required: true,
    },

    seatNumber: {
      type: String,
      required: true,
    },

    fare: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Booked", "Cancelled", "Completed"],
      default: "Booked",
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;