import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },

    ticketId: {
      type: String,
      required: true,
    },

    passengerName: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        "UPI",
        "Debit Card",
        "Credit Card",
        "Net Banking",
        "Cash",
      ],
      default: "UPI",
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: [
        "Paid",
        "Pending",
        "Failed",
        "Refunded",
      ],
      default: "Paid",
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;