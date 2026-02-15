const bcrypt = require("bcrypt");

const checkPassword = async (req, res, next) => {
  const paste = req.paste;

  if (!paste.passwordHash) return next();

  const { password } = req.query;

  if (!password) {
    return res.status(401).json({ message: "Password required" });
  }

  const valid = await bcrypt.compare(password, paste.passwordHash);
  if (!valid) {
    return res.status(403).json({ message: "Incorrect password" });
  }

  next();
};

module.exports = checkPassword;
