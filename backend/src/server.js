const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
require("dotenv").config();

const uploadRoutes = require("./routes/upload.routes");
const viewRoutes = require("./routes/view.routes");
const fileRoutes = require("./routes/file.routes");
const deleteRoutes = require("./routes/delete.routes");
const pastesRoutes = require("./routes/paste.routes");
const authRoutes = require("./routes/auth.routes");       
const userRoutes = require("./routes/user.routes");       
const oauthRoutes = require("./routes/oauth.routes");     

const startCleanupJob = require("./jobs/cleanupExpired");

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// OAuth controller config
require("./controllers/oauth.controller");

// ROUTES
app.use("/api", uploadRoutes);
app.use("/api", viewRoutes);
app.use("/api", fileRoutes);
app.use("/api", deleteRoutes);
app.use("/api", pastesRoutes);
app.use("/api/auth", authRoutes);        
app.use("/api/user", userRoutes);        
app.use("/api/oauth", oauthRoutes);      

// static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("LinkVault backend running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas connected");
    startCleanupJob();
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});