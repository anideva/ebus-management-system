import mongoose from "mongoose";
import Bus from "../models/bus.js";
import Route from "../models/route.js";
import Ticket from "../models/ticket.js";
import Payment from "../models/payment.js";
import Pass from "../models/pass.js";
import { seedDemoDataService } from "../utils/demoData.js";

/**
 * GET /api/portal/services
 * Returns active bus services merged with route details for passenger search.
 */
export const getAvailableServices = async (req, res) => {
  try {
    const { source, destination } = req.query;

    let [buses, routes] = await Promise.all([
      Bus.find({ status: "Active" }),
      Route.find({ status: "Active" }),
    ]);

    // If database has 0 active buses (e.g. freshly initialized database), auto-seed demo data
    if (buses.length === 0 && process.env.NODE_ENV !== "test") {
      try {
        await seedDemoDataService();
        [buses, routes] = await Promise.all([
          Bus.find({ status: "Active" }),
          Route.find({ status: "Active" }),
        ]);
      } catch (seedErr) {
        console.warn("Auto-seeding during getAvailableServices encountered an issue:", seedErr.message);
      }
    }

    const routeMap = new Map();
    routes.forEach((r) => {
      routeMap.set(r.routeName, r);
    });

    let services = buses.map((bus) => {
      const routeInfo = routeMap.get(bus.route);
      const isEV = bus.busType ? bus.busType.toLowerCase().includes("electric") || bus.busType.toLowerCase().includes("ev") : false;
      const departureTime = bus.departureTime || (bus.busNumber.includes("1001") ? "07:00 AM" : bus.busNumber.includes("1002") ? "11:30 AM" : bus.busNumber.includes("2001") ? "04:30 PM" : bus.busNumber.includes("3001") ? "06:15 AM" : bus.busNumber.includes("3002") ? "02:00 PM" : bus.busNumber.includes("4001") ? "08:00 PM" : "08:30 AM");
      const durationHours = routeInfo?.estimatedTime ? `${Math.floor(routeInfo.estimatedTime / 60)}h ${routeInfo.estimatedTime % 60}m` : "2h 30m";

      return {
        _id: bus._id,
        busNumber: bus.busNumber,
        busName: bus.busName || bus.route,
        busType: bus.busType,
        isEV,
        driver: bus.driver,
        routeName: bus.route,
        capacity: bus.capacity,
        fare: bus.fare,
        source: routeInfo?.source || "Main Terminal",
        destination: routeInfo?.destination || "City Center",
        departureTime,
        duration: durationHours,
        stops: routeInfo?.stops || [],
        distance: routeInfo?.distance || 0,
        estimatedTime: routeInfo?.estimatedTime || 0,
        statusBadge: "On Schedule",
      };
    });

    if (source && source.trim()) {
      const srcQuery = source.trim().toLowerCase();
      services = services.filter(
        (s) =>
          s.source.toLowerCase().includes(srcQuery) ||
          s.stops.some((stop) => stop.toLowerCase().includes(srcQuery))
      );
    }

    if (destination && destination.trim()) {
      const destQuery = destination.trim().toLowerCase();
      services = services.filter(
        (s) =>
          s.destination.toLowerCase().includes(destQuery) ||
          s.stops.some((stop) => stop.toLowerCase().includes(destQuery))
      );
    }

    res.json(services);
  } catch (error) {
    console.error("Error retrieving available services:", error);
    res.status(500).json({ message: "Failed to retrieve available services" });
  }
};

/**
 * GET /api/portal/availability
 * Returns live seat status for a given bus and journey date.
 */
export const getSeatAvailability = async (req, res) => {
  try {
    const { busNumber, journeyDate } = req.query;

    if (!busNumber || !journeyDate) {
      return res.status(400).json({
        message: "Both busNumber and journeyDate query parameters are required",
      });
    }

    const bus = await Bus.findOne({ busNumber, status: "Active" });
    if (!bus) {
      return res.status(404).json({
        message: `Active bus with number '${busNumber}' was not found`,
      });
    }

    const bookedTickets = await Ticket.find({
      busNumber,
      journeyDate,
      status: "Booked",
    });

    const bookedSeats = bookedTickets.map((t) => String(t.seatNumber));
    const totalCapacity = bus.capacity || 40;
    const availableSeatsCount = Math.max(0, totalCapacity - bookedSeats.length);

    res.json({
      busNumber: bus.busNumber,
      busName: bus.busName,
      capacity: totalCapacity,
      fare: bus.fare,
      bookedSeats,
      availableSeatsCount,
    });
  } catch (error) {
    console.error("Error retrieving seat availability:", error);
    res.status(500).json({ message: "Failed to retrieve seat availability" });
  }
};

/**
 * POST /api/portal/book-ticket
 * Atomic ticket booking with server-enforced fare and seat collision prevention.
 */
export const bookTicket = async (req, res) => {
  try {
    const {
      busNumber,
      routeName,
      journeyDate,
      seatNumber,
      passengerName,
      paymentMethod,
    } = req.body;

    if (!busNumber || !journeyDate || seatNumber === undefined || seatNumber === null) {
      return res.status(400).json({
        message: "busNumber, journeyDate, and seatNumber are required",
      });
    }

    const parsedSeat = parseInt(seatNumber, 10);
    if (isNaN(parsedSeat) || parsedSeat < 1) {
      return res.status(400).json({
        message: "Invalid seat number provided",
      });
    }

    const bus = await Bus.findOne({ busNumber, status: "Active" });
    if (!bus) {
      return res.status(404).json({
        message: `Bus '${busNumber}' is not active or does not exist`,
      });
    }

    if (parsedSeat > bus.capacity) {
      return res.status(400).json({
        message: `Seat number ${parsedSeat} exceeds bus capacity of ${bus.capacity}`,
      });
    }

    // Atomic collision check: Ensure seat is not already booked for this bus and date
    const existingTicket = await Ticket.findOne({
      busNumber,
      journeyDate,
      seatNumber: String(parsedSeat),
      status: "Booked",
    });

    if (existingTicket) {
      return res.status(409).json({
        message: `Seat ${parsedSeat} is already booked for ${journeyDate}. Please select another seat.`,
      });
    }

    const resolvedPassengerName =
      (passengerName && passengerName.trim()) ||
      req.user.displayName ||
      req.user.name ||
      "Passenger";

    const ticketId = `TKT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let newTicket;
    try {
      newTicket = await Ticket.create({
        ticketId,
        passengerName: resolvedPassengerName,
        busNumber: bus.busNumber,
        routeName: routeName || bus.route,
        journeyDate,
        seatNumber: String(parsedSeat),
        fare: bus.fare, // Server-derived canonical fare
        status: "Booked",
        userId: req.user.uid,
        userEmail: (req.user.email || "").toLowerCase(),
      });
    } catch (createError) {
      // Handle MongoDB duplicate key error (11000) from partial unique index
      if (createError.code === 11000 || (createError.message && createError.message.includes("E11000"))) {
        return res.status(409).json({
          message: `Seat ${parsedSeat} on Bus ${bus.busNumber} was just booked for ${journeyDate}. Please select another seat.`,
        });
      }
      throw createError;
    }

    // Create corresponding payment record
    const paymentId = `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const resolvedTxnId =
      (req.body.transactionId && req.body.transactionId.trim()) ||
      `TXN-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newPayment = await Payment.create({
      paymentId,
      ticketId: newTicket.ticketId,
      passengerName: resolvedPassengerName,
      amount: bus.fare,
      paymentMethod: paymentMethod || "UPI",
      transactionId: resolvedTxnId,
      status: paymentMethod === "Cash at Boarding" ? "Pending" : "Paid",
      userId: req.user.uid,
      userEmail: (req.user.email || "").toLowerCase(),
    });

    res.status(201).json({
      message: "Ticket booked successfully",
      ticket: newTicket,
      payment: newPayment,
    });
  } catch (error) {
    console.error("Error booking ticket:", error);
    res.status(500).json({ message: "Failed to book ticket: " + error.message });
  }
};

/**
 * GET /api/portal/my-tickets
 * Retrieve tickets belonging to the authenticated passenger.
 */
export const getMyTickets = async (req, res) => {
  try {
    const userEmail = (req.user.email || "").toLowerCase();
    const tickets = await Ticket.find({
      $or: [
        { userId: req.user.uid },
        ...(userEmail ? [{ userEmail }] : []),
      ],
    }).sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("Error retrieving user tickets:", error);
    res.status(500).json({ message: "Failed to retrieve tickets" });
  }
};

/**
 * PUT /api/portal/cancel-ticket/:id
 * Self-service ticket cancellation with internal payment status update.
 */
export const cancelTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const query = mongoose.isValidObjectId(id)
      ? { $or: [{ _id: id }, { ticketId: id }] }
      : { ticketId: id };

    const ticket = await Ticket.findOne(query);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Hardened ownership check: missing/undefined user IDs can never match
    const hasUserIdMatch = Boolean(
      ticket.userId &&
      req.user?.uid &&
      ticket.userId === req.user.uid
    );

    const hasUserEmailMatch = Boolean(
      ticket.userEmail &&
      req.user?.email &&
      ticket.userEmail.toLowerCase() === req.user.email.toLowerCase()
    );

    const isOwner = hasUserIdMatch || hasUserEmailMatch;
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You do not have permission to cancel this ticket",
      });
    }

    if (ticket.status === "Cancelled") {
      return res.status(400).json({ message: "Ticket is already cancelled" });
    }

    ticket.status = "Cancelled";
    await ticket.save();

    // Mark internal payment record status as Refunded
    await Payment.findOneAndUpdate(
      { ticketId: ticket.ticketId },
      { status: "Refunded" }
    );

    res.json({
      message: "Ticket cancelled successfully. Reservation released and internal payment record marked as Refunded.",
      ticket,
    });
  } catch (error) {
    console.error("Error cancelling ticket:", error);
    res.status(500).json({ message: "Failed to cancel ticket" });
  }
};

/**
 * POST /api/portal/apply-pass
 * Apply for student/passenger bus pass.
 */
export const applyPass = async (req, res) => {
  try {
    const { studentName, studentId, busNumber, routeName, passType } = req.body;

    if (!studentName || !studentId || !busNumber || !routeName) {
      return res.status(400).json({
        message: "studentName, studentId, busNumber, and routeName are required",
      });
    }

    const validPassType = ["Monthly", "Quarterly", "Yearly"].includes(passType)
      ? passType
      : "Monthly";

    const validFrom = new Date();
    const validUntil = new Date(validFrom);

    if (validPassType === "Monthly") {
      validUntil.setDate(validUntil.getDate() + 30);
    } else if (validPassType === "Quarterly") {
      validUntil.setDate(validUntil.getDate() + 90);
    } else if (validPassType === "Yearly") {
      validUntil.setDate(validUntil.getDate() + 365);
    }

    const passId = `PASS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPass = await Pass.create({
      passId,
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      busNumber: busNumber.trim(),
      routeName: routeName.trim(),
      validFrom,
      validUntil,
      passType: validPassType,
      status: "Active",
      userId: req.user.uid,
      userEmail: (req.user.email || "").toLowerCase(),
    });

    // Create corresponding ledger payment record for pass subscription fee
    const passFee = validPassType === "Yearly" ? 5000 : validPassType === "Quarterly" ? 1500 : 600;
    const paymentId = `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const resolvedTxnId =
      (req.body.transactionId && req.body.transactionId.trim()) ||
      `TXN-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

    await Payment.create({
      paymentId,
      ticketId: newPass.passId,
      passengerName: studentName.trim(),
      amount: passFee,
      paymentMethod: req.body.paymentMethod || "UPI",
      transactionId: resolvedTxnId,
      status: "Paid",
      userId: req.user.uid,
      userEmail: (req.user.email || "").toLowerCase(),
    });

    res.status(201).json({
      message: "Bus pass applied and issued successfully",
      pass: newPass,
    });
  } catch (error) {
    console.error("Error applying for pass:", error);
    res.status(500).json({ message: "Failed to apply for pass: " + error.message });
  }
};

/**
 * GET /api/portal/my-passes
 * Retrieve passes belonging to the authenticated passenger.
 */
export const getMyPasses = async (req, res) => {
  try {
    const userEmail = (req.user.email || "").toLowerCase();
    const passes = await Pass.find({
      $or: [
        { userId: req.user.uid },
        ...(userEmail ? [{ userEmail }] : []),
      ],
    }).sort({ createdAt: -1 });

    res.json(passes);
  } catch (error) {
    console.error("Error retrieving user passes:", error);
    res.status(500).json({ message: "Failed to retrieve passes" });
  }
};
