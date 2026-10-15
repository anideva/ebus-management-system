import "dotenv/config";
import mongoose from "mongoose";
import Ticket from "../models/ticket.js";

async function syncAndVerifyIndexes() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not set in environment.");
    process.exit(1);
  }

  try {
    console.log("1. Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("✓ Connected to MongoDB Atlas successfully.");

    console.log("\n2. Checking existing indexes on 'tickets' collection...");
    let initialIndexes = [];
    try {
      initialIndexes = await Ticket.collection.indexes();
      console.log(`Found ${initialIndexes.length} existing index(es):`);
      initialIndexes.forEach((idx) => {
        console.log(` - Name: ${idx.name}, Keys: ${JSON.stringify(idx.key)}, Unique: ${Boolean(idx.unique)}, Partial: ${JSON.stringify(idx.partialFilterExpression || null)}`);
      });
    } catch (e) {
      console.log("No existing collection or indexes yet:", e.message);
    }

    console.log("\n3. Creating / Ensuring Mongoose indexes for Ticket model...");
    await Ticket.createIndexes();
    console.log("✓ Ticket.createIndexes() completed successfully.");

    console.log("\n4. Verifying live indexes on 'tickets' collection in Atlas...");
    const liveIndexes = await Ticket.collection.indexes();
    console.log(`Verified ${liveIndexes.length} live index(es) in MongoDB Atlas:`);
    liveIndexes.forEach((idx, i) => {
      console.log(`\n[Index #${i + 1}]`);
      console.log(`  Name: ${idx.name}`);
      console.log(`  Key Pattern: ${JSON.stringify(idx.key)}`);
      console.log(`  Unique: ${Boolean(idx.unique)}`);
      console.log(`  Partial Filter Expression: ${JSON.stringify(idx.partialFilterExpression || null)}`);
    });

    // Locate the specific target partial unique index
    const targetIndex = liveIndexes.find(
      (idx) =>
        idx.key &&
        idx.key.busNumber === 1 &&
        idx.key.journeyDate === 1 &&
        idx.key.seatNumber === 1
    );

    if (!targetIndex) {
      console.error("\n❌ Target index { busNumber: 1, journeyDate: 1, seatNumber: 1 } was NOT found in live indexes!");
      process.exit(1);
    }

    if (!targetIndex.unique) {
      console.error("\n❌ Target index exists but unique flag is FALSE!");
      process.exit(1);
    }

    const hasPartial =
      targetIndex.partialFilterExpression &&
      targetIndex.partialFilterExpression.status === "Booked";

    if (!hasPartial) {
      console.error("\n❌ Target index exists but partialFilterExpression does NOT match { status: 'Booked' }!");
      process.exit(1);
    }

    console.log("\n========================================================");
    console.log("✅ VERIFICATION SUCCESSFUL:");
    console.log(`  Index Name: ${targetIndex.name}`);
    console.log(`  Fields: { busNumber: 1, journeyDate: 1, seatNumber: 1 }`);
    console.log(`  Unique: ${targetIndex.unique}`);
    console.log(`  PartialFilterExpression: ${JSON.stringify(targetIndex.partialFilterExpression)}`);
    console.log("========================================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error syncing or verifying indexes:", error.message);
    process.exit(1);
  }
}

syncAndVerifyIndexes();
