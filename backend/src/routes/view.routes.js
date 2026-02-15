const express = require("express");
const router = express.Router();

const loadPaste = require("../middlewares/loadPaste");
const checkExpiry = require("../middlewares/checkExpiry");
const checkPassword = require("../middlewares/checkPassword");
const checkViewLimit = require("../middlewares/checkViewLimit");
const viewPaste = require("../controllers/view.controller");

router.get(
  "/view/:id",
  loadPaste,
  checkExpiry,
  checkPassword,
  checkViewLimit,
  viewPaste
);

module.exports = router;
