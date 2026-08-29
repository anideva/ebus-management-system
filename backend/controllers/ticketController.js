import Ticket from "../models/ticket.js";

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tickets",
      error: error.message,
    });
  }
};

export const createTicket = async (req, res) => {
  try {
    const newTicket = await Ticket.create(req.body);

    res.status(201).json(newTicket);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create ticket",
      error: error.message,
    });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedTicket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update ticket",
      error: error.message,
    });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);

    if (!deletedTicket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      message: "Ticket deleted successfully",
      ticket: deletedTicket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete ticket",
      error: error.message,
    });
  }
};