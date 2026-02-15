const express = require("express");
const router = express.Router();
const Paste = require("../models/Paste.model");

/**
 * Bulk fetch paste metadata (My Pastes page)
 * Body: { ids: [pasteId1, pasteId2, ...] }
 */
router.post("/pastes/bulk", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids must be a non-empty array" });
    }

    const pastes = await Paste.find(
      { pasteId: { $in: ids } },
      {
        pasteId: 1,
        type: 1,
        createdAt: 1,
        expiresAt: 1,
        maxViews: 1,
        currentViews: 1,
        isExpired: 1,
      }
    ).sort({ createdAt: -1 });

    res.json(pastes);
  } catch (err) {
    console.error("BULK FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch pastes" });
  }
});

module.exports = router;
