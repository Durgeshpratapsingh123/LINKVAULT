const checkExpiry = async (req, res, next) => {
  const paste = req.paste;

  if (paste.isExpired) {
    return res.status(403).json({ message: "Link expired" });
  }

  if (paste.expiresAt && paste.expiresAt < new Date()) {
    paste.isExpired = true;
    await paste.save();
    return res.status(403).json({ message: "Link expired" });
  }

  next();
};

module.exports = checkExpiry;
