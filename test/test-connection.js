// scripts/test-connection.js
import clientPromise from "../lib/mongodb";

async function testConnection() {
  try {
    console.log("Testing MongoDB connection...");
    const client = await clientPromise;
    const db = client.db(); // Get the default database
    console.log("Connected to MongoDB:", db.databaseName);
    console.log("MongoDB Connection Successful!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
  }
}

testConnection();