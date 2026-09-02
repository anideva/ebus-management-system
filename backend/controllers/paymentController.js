import Payment from "../models/payment.js";

// GET all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

// CREATE a new payment
export const createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);

    const savedPayment = await payment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create payment",
      error: error.message,
    });
  }
};

// UPDATE a payment
export const updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
  req.params.id,
  req.body,
  {
    returnDocument: "after",
    runValidators: true,
  }
);

    if (!updatedPayment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update payment",
      error: error.message,
    });
  }
};

// DELETE a payment
export const deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(
      req.params.id
    );

    if (!deletedPayment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json({
      message: "Payment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete payment",
      error: error.message,
    });
  }
};