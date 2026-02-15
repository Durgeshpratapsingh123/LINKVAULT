const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.username = decoded.username;
    
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      req.username = decoded.username;
      console.log("✅ Optional Auth: User authenticated", decoded.userId); // ✅ Add this log
    } else {
      console.log("⚠️ Optional Auth: No token provided"); // ✅ Add this log
    }
    
    next();
  } catch (err) {
    console.log("⚠️ Optional Auth: Invalid token", err.message); // ✅ Add this log
    // Invalid token, but continue anyway
    next();
  }
};

module.exports = { authMiddleware, optionalAuth };