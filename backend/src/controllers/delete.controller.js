const Paste = require("../models/Paste.model");
const fs = require("fs");
const path = require("path");

const deletePaste = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteToken = req.headers["x-delete-token"];

    if (!deleteToken) {
      return res.status(400).json({ message: "Delete token required" });
    }

    // Find by pasteId, not _id
    const paste = await Paste.findOne({ pasteId: id });

    console.log(`🔍 DELETE: Looking for paste ID: ${id}`);
    console.log(`📦 Found paste:`, paste ? `Yes (${paste._id})` : "No");

    if (!paste) {
      return res.status(404).json({ message: "Paste not found" });
    }

    if (paste.deleteToken !== deleteToken) {
      return res.status(403).json({ message: "Invalid delete token" });
    }

    // 🔥 DELETE FILE SAFELY
    if (paste.type === "file" && paste.fileUrl) {
      const relativePath = paste.fileUrl.replace(/^\/+/, ""); // remove leading /
      const filePath = path.join(__dirname, "../../", relativePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Paste.deleteOne({ pasteId: id });

    return res.json({ success: true });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = deletePaste;
