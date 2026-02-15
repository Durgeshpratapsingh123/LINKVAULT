const express = require("express");
const upload = require("../utils/storage");
const uploadPaste = require("../controllers/upload.controller");
const { optionalAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/upload", optionalAuth, upload.single("file"), uploadPaste); // ✅ Make sure optionalAuth is here

module.exports = router;