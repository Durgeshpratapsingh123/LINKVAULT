const express = require("express");
const router = express.Router();
const downloadFile = require("../controllers/file.controller");

router.get("/file/:id", downloadFile);

module.exports = router;
