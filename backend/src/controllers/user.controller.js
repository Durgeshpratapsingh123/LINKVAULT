const User = require("../models/User.model");
const Paste = require("../models/Paste.model");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pasteCount = await Paste.countDocuments({ userId: req.userId });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatar,
        createdAt: user.createdAt,
        pasteCount,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to get profile" });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = username;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Failed to change password" });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all user's pastes and files
    const pastes = await Paste.find({ userId: req.userId });
    
    for (const paste of pastes) {
      if (paste.type === "file" && paste.fileUrl) {
        const filePath = path.join(__dirname, "../../", paste.fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      await paste.deleteOne();
    }

    await User.findByIdAndDelete(req.userId);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Failed to delete account" });
  }
};

// Get user's pastes
const getUserPastes = async (req, res) => {
  try {
    const pastes = await Paste.find({ userId: req.userId })
      .select('pasteId type expiresAt maxViews currentViews createdAt')
      .sort({ createdAt: -1 });

    res.json({ pastes });
  } catch (err) {
    console.error("Get user pastes error:", err);
    res.status(500).json({ message: "Failed to get pastes" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getUserPastes,
};