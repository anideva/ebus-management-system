import "dotenv/config";
import mongoose from "mongoose";
import { seedDemoDataService } from "../utils/demoData.js";

async function runSeed() {
  if (!process.env.MONGO_URI) {
    console.error("❌ Error: MONGO_URI is not set in backend/.env");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("✓ Connected to MongoDB Atlas.");

    console.log("\nPopulating demo transit network (routes, buses, drivers, students, passes)...");
    const counts = await seedDemoDataService();

    console.log("\n🎉 Demo transit network seeded successfully!");
    console.log(`  ✓ ${counts.routes} Transit Routes`);
    console.log(`  ✓ ${counts.buses} Fleet Buses with assigned routes & fares`);
    console.log(`  ✓ ${counts.drivers} Commercial Drivers with licenses & buses`);
    console.log(`  ✓ ${counts.students} Registered Students`);
    console.log(`  ✓ ${counts.passes} Active Commuter & Student Passes`);
    console.log("\nYou can now open the app to test search, seat booking, and administrative features!\n");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

runSeed();
