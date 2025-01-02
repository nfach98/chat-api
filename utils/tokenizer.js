require("dotenv").config();
const jwt = require("jsonwebtoken");

function createToken(id) {
  return jwt.sign({ id: id }, process.env.TOKEN_KEY);
}

function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    return decoded.id;
  } catch {
    return "";
  }
}

module.exports = {
  createToken,
  decodeToken,
};
