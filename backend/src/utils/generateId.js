const crypto = require("crypto");

const generateId = (length = 12) => {
  return crypto.randomBytes(length).toString("base64url");
};

module.exports = generateId;
