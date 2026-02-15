const express = require("express");
const { body } = require("express-validator");
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getUserPastes,
} = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get profile
router.get("/profile", getProfile);

// Update profile
router.put(
  "/profile",
  [
    body("username")
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be 3-30 characters"),
  ],
  updateProfile
);

// Change password
router.post(
  "/change-password",
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  changePassword
);

// Delete account
router.delete("/account", deleteAccount);

// Get user's pastes
router.get("/pastes", getUserPastes);

module.exports = router;