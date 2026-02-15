const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be 3-30 characters"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  register
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

// Verify email
router.get("/verify-email/:token", verifyEmail);

// Forgot password
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Invalid email")],
  forgotPassword
);

// Reset password
router.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  resetPassword
);

// Get current user
router.get("/me", authMiddleware, getMe);

module.exports = router;