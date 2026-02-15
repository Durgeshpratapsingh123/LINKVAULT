const Paste = require("../models/Paste.model");
const generateId = require("../utils/generateId");
const bcrypt = require("bcrypt");

const uploadPaste = async (req, res) => {
  try {
    const { text, expiresIn, password, oneTimeView, maxViews } = req.body;

    console.log("📝 Upload Request - userId:", req.userId); // ✅ Debug log

    if ((!text && !req.file) || (text && req.file)) {
      return res.status(400).json({
        message: "Provide either text or a file (only one)",
      });
    }

    // ✅ File size validation
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (req.file && req.file.size > MAX_FILE_SIZE) {
      const fs = require('fs');
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: "File too large. Maximum size is 10MB",
      });
    }

    const expirySeconds =
      expiresIn && !isNaN(expiresIn) ? Number(expiresIn) : 600;

    const expiresAt =
      expirySeconds > 0
        ? new Date(Date.now() + expirySeconds * 1000)
        : null;

    const pasteId = generateId();
    const deleteToken = generateId() + generateId();

    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const paste = await Paste.create({
      pasteId,
      userId: req.userId || null,      // ✅ ADD THIS - Link to user if authenticated
      isAnonymous: !req.userId,        // ✅ ADD THIS - Mark as anonymous if no user
      type: text ? "text" : "file",
      content: text || null,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      fileMeta: req.file
        ? {
            filename: req.file.originalname,
            filesize: req.file.size,
            mimetype: req.file.mimetype,
          }
        : null,
      expiresAt,
      passwordHash,
      oneTimeView: oneTimeView === true || oneTimeView === "true",
      maxViews: maxViews ? Number(maxViews) : null,
      deleteToken,
    });

    console.log("✅ Paste created:", {
      pasteId: paste.pasteId,
      userId: paste.userId,
      isAnonymous: paste.isAnonymous
    }); // ✅ Debug log

    res.status(201).json({
      id: paste.pasteId,
      url: `/view/${paste.pasteId}`,
      deleteToken,
      expiresAt,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

module.exports = uploadPaste;