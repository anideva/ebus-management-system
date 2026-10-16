import Bus from "../models/bus.js";
import Ticket from "../models/ticket.js";

export const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find();

    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch buses",
      error: error.message,
    });
  }
};

export const createBus = async (req, res) => {
  try {
    const newBus = await Bus.create(req.body);

    res.status(201).json(newBus);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create bus",
      error: error.message,
    });
  }
};
export const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found",
      });
    }

    // Stage 1: Active buses cannot be deleted directly to avoid in-flight booking races
    if (bus.status === "Active") {
      return res.status(409).json({
        message: `Cannot delete active bus ${bus.busNumber}. Please change the bus status to 'Maintenance' first to prevent concurrent passenger bookings.`,
      });
    }

    // Stage 2: Check for active booked tickets before allowing bus deletion
    const activeTicketsCount = await Ticket.countDocuments({
      busNumber: bus.busNumber,
      status: "Booked",
    });

    if (activeTicketsCount > 0) {
      return res.status(409).json({
        message: `Cannot delete bus ${bus.busNumber}. There are ${activeTicketsCount} active booked ticket(s) for this bus. Please cancel or resolve the tickets before deleting the bus.`,
        activeTicketsCount,
      });
    }

    const deletedBus = await Bus.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Bus deleted successfully",
      bus: deletedBus,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete bus",
      error: error.message,
    });
  }
};
export const updateBus = async (req, res) => {
  try {
    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedBus) {
      return res.status(404).json({
        message: "Bus not found",
      });
    }

    res.status(200).json(updatedBus);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update bus",
      error: error.message,
    });
  }
};