const express = require("express");
const passport = require("passport");
const { googleCallback } = require("../controllers/oauth.controller");

const router = express.Router();

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback
);

module.exports = router;