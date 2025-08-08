// server/jobs/cleanup.js
const cron = require("node-cron");
const Alert = require("../models/Alert");
const BloodRequest = require("../models/BloodRequest");

// Function to remove records older than 1 hour
const cleanupOldData = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const alertResult = await Alert.deleteMany({ createdAt: { $lt: oneHourAgo } });
    const bloodResult = await BloodRequest.deleteMany({ createdAt: { $lt: oneHourAgo } });

    console.log(`✅ Cleanup Done: ${alertResult.deletedCount} alerts, ${bloodResult.deletedCount} blood requests deleted.`);
  } catch (error) {
    console.error("❌ Cleanup Error:", error.message);
  }
};

// Run once immediately on app start
cleanupOldData();

// Schedule job to run every hour
cron.schedule("0 * * * *", () => {
  console.log("🕒 Running scheduled cleanup...");
  cleanupOldData();
});
