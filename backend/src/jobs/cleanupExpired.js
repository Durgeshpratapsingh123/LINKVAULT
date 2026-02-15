const cron = require("node-cron");
const Paste = require("../models/Paste.model");
const fs = require("fs");
const path = require("path");

const cleanupExpiredPastes = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();

      // Get expired pastes with files
      const expiredPastes = await Paste.find({
        expiresAt: { $lt: now },
      });

      // Delete files first
      for (const paste of expiredPastes) {
        if (paste.type === "file" && paste.fileUrl) {
          const filePath = path.join(
            __dirname,
            "../../",
            paste.fileUrl
          );

          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (err) {
              console.error(`Failed to delete file: ${filePath}`, err);
            }
          }
        }
      }

      // ✅ Delete all expired pastes in one query
      const result = await Paste.deleteMany({
        expiresAt: { $lt: now },
      });

      if (result.deletedCount > 0) {
        console.log(
          `🧹 Cleanup job: removed ${result.deletedCount} expired pastes`
        );
      }
    } catch (err) {
      console.error("CLEANUP JOB ERROR:", err);
    }
  });
};

module.exports = cleanupExpiredPastes;