import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.resolve(__dirname, "../firebase-service-account.json");

let credential = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
    // Support base64 encoded or direct JSON string
    const jsonString = raw.startsWith("{")
      ? raw
      : Buffer.from(raw, "base64").toString("utf8");
    const parsed = JSON.parse(jsonString);
    credential = admin.credential.cert(parsed);
  } catch (err) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:", err.message);
  }
} else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  try {
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
  } catch (err) {
    console.error("Failed to configure Firebase Admin with individual env vars:", err.message);
  }
} else if (fs.existsSync(serviceAccountPath)) {
  try {
    const raw = fs.readFileSync(serviceAccountPath, "utf-8");
    const parsed = JSON.parse(raw);
    credential = admin.credential.cert(parsed);
  } catch (err) {
    console.error("Failed to read firebase-service-account.json:", err.message);
  }
}

if (!admin.apps.length) {
  if (credential) {
    admin.initializeApp({
      credential,
    });
    console.log("Firebase Admin initialized successfully");
  } else {
    console.warn(
      "⚠️ Firebase Admin initialized without service account credentials. Provide FIREBASE_SERVICE_ACCOUNT or firebase-service-account.json."
    );
    admin.initializeApp();
  }
}

export default admin;