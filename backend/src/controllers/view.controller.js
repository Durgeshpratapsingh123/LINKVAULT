const viewPaste = async (req, res) => {
  const paste = req.paste;

  paste.currentViews += 1;
  if (paste.oneTimeView) paste.isExpired = true;
  await paste.save();

  if (paste.type === "text") {
    return res.json({
      type: "text",
      content: paste.content,
      expiresAt: paste.expiresAt,
      maxViews: paste.maxViews,
      currentViews: paste.currentViews,
    });
  }

  return res.json({
    type: "file",
    fileMeta: paste.fileMeta,
    expiresAt: paste.expiresAt,
    maxViews: paste.maxViews,
    currentViews: paste.currentViews,
  });
};

module.exports = viewPaste;
