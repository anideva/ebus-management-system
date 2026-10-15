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

    userId: {
      type: String,
      index: true,
    },

    userEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound partial unique index: prevents duplicate active bookings for the same seat,
// bus, and journey date while allowing cancelled tickets to exist without blocking rebooking.
ticketSchema.index(
  { busNumber: 1, journeyDate: 1, seatNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "Booked" },
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;