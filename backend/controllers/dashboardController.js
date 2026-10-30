import Bus from "../models/bus.js";
import Driver from "../models/driver.js";
import Student from "../models/student.js";
import Route from "../models/route.js";
import Ticket from "../models/ticket.js";
import Pass from "../models/pass.js";
import Payment from "../models/payment.js";
import { seedDemoDataService } from "../utils/demoData.js";

export const getRecentActivity = async (req, res) => {
  try {
    const [buses, drivers, students, routes, tickets, passes, payments] =
      await Promise.all([
        Bus.find().sort({ createdAt: -1 }).limit(5),
        Driver.find().sort({ createdAt: -1 }).limit(5),
        Student.find().sort({ createdAt: -1 }).limit(5),
        Route.find().sort({ createdAt: -1 }).limit(5),
        Ticket.find().sort({ createdAt: -1 }).limit(5),
        Pass.find().sort({ createdAt: -1 }).limit(5),
        Payment.find().sort({ createdAt: -1 }).limit(5),
      ]);

    const activities = [
      ...buses.map((bus) => ({
        type: "Bus",
        message: `Bus ${bus.busNumber} was added`,
        createdAt: bus.createdAt,
      })),

      ...drivers.map((driver) => ({
        type: "Driver",
        message: `Driver ${driver.driverName} was added`,
        createdAt: driver.createdAt,
      })),

      ...students.map((student) => ({
        type: "Student",
        message: `Student ${student.studentName} was registered`,
        createdAt: student.createdAt,
      })),

      ...routes.map((route) => ({
        type: "Route",
        message: `Route ${route.routeName} was added`,
        createdAt: route.createdAt,
      })),

      ...tickets.map((ticket) => ({
        type: "Ticket",
        message: `Ticket ${ticket.ticketId} was created`,
        createdAt: ticket.createdAt,
      })),

      ...passes.map((pass) => ({
        type: "Pass",
        message: `Pass ${pass.passId} was created`,
        createdAt: pass.createdAt,
      })),

      ...payments.map((payment) => ({
        type: "Payment",
        message: `Payment ${payment.paymentId} was recorded`,
        createdAt: payment.createdAt,
      })),
    ];

    activities.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json(activities.slice(0, 10));
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recent activity",
      error: error.message,
    });
  }
};

/**
 * POST /api/dashboard/seed-demo
 * Populates or updates the database with a realistic Assam transit dataset.
 * Requires admin authentication.
 */
export const seedDemoData = async (req, res) => {
  try {
    const result = await seedDemoDataService();
    res.status(200).json({
      message: "Demo transit network populated successfully",
      result,
    });
  } catch (error) {
    console.error("Error seeding demo data:", error);
    res.status(500).json({
      message: "Failed to seed demo data",
      error: error.message,
    });
  }
};
