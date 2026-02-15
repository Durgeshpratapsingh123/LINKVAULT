const Paste = require("../models/Paste.model");
const path = require("path");

const downloadFile = async (req, res) => {
  try {
    const paste = await Paste.findOne({ pasteId: req.params.id });

    if (!paste || paste.type !== "file") {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "../../", paste.fileUrl);
    res.download(filePath, paste.fileMeta.filename);
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ message: "Download failed" });
  }
};

module.exports = downloadFile;
