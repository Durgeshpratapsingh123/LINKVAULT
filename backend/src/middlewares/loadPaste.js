const Paste = require("../models/Paste.model");

const loadPaste = async (req, res, next) => {
  try {
    const paste = await Paste.findOne({ pasteId: req.params.id });
    if (!paste) {
      return res.status(404).json({ message: "Invalid link" });
    }
    req.paste = paste;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = loadPaste;
