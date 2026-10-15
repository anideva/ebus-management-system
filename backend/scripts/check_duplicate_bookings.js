import "dotenv/config";
import mongoose from "mongoose";
import Ticket from "../models/ticket.js";

async function checkDuplicateBookings() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set in environment.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log("✓ Connected successfully.");

    console.log("Scanning active 'Booked' tickets for duplicate (busNumber, journeyDate, seatNumber)...");

    const duplicates = await Ticket.aggregate([
      { $match: { status: "Booked" } },
      {
        $group: {
          _id: {
            busNumber: "$busNumber",
            journeyDate: "$journeyDate",
            seatNumber: "$seatNumber",
          },
          count: { $sum: 1 },
          tickets: {
            $push: {
              ticketId: "$ticketId",
              passengerName: "$passengerName",
              createdAt: "$createdAt",
              id: "$_id",
            },
          },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    if (duplicates.length === 0) {
      console.log("✓ No duplicate active bookings found in the database.");
      console.log("✓ The partial unique index on { busNumber: 1, journeyDate: 1, seatNumber: 1 } can be safely created.");
    } else {
      console.warn(`⚠️ Found ${duplicates.length} conflicting duplicate active booking(s):`);
      duplicates.forEach((dup, index) => {
        console.log(`\nConflict #${index + 1}:`);
        console.log(`  Bus: ${dup._id.busNumber}, Date: ${dup._id.journeyDate}, Seat: ${dup._id.seatNumber}`);
        console.log(`  Conflicting count: ${dup.count}`);
        dup.tickets.forEach((t) => {
          console.log(`    - Ticket ID: ${t.ticketId}, Passenger: ${t.passengerName}, Booked At: ${t.createdAt}`);
        });
      });
      console.log("\nProposed safe resolution:");
      console.log("1. Review each conflict with the transport administrator.");
      console.log("2. For genuine duplicates, update the superseded ticket status to 'Cancelled' via the admin panel rather than deleting records.");
      console.log("3. Once resolved, index creation will succeed without data loss.");
    }

    await mongoose.disconnect();
    process.exit(duplicates.length > 0 ? 2 : 0);
  } catch (error) {
    console.error("❌ Error running duplicate booking check:", error.message);
    process.exit(1);
  }
}

checkDuplicateBookings();
