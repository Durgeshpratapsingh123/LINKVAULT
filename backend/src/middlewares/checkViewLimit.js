const checkViewLimit = (req, res, next) => {
  const paste = req.paste;

  if (
    typeof paste.maxViews === "number" &&
    paste.currentViews >= paste.maxViews
  ) {
    return res.status(403).json({ message: "View limit reached" });
  }

  next();
};

module.exports = checkViewLimit;
