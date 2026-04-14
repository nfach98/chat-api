const { decodeToken } = require("../utils/tokenizer");

function authenticate(req, res, next) {
  try {
    const authHeader = req.header("authorization");

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header required" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token required" });
    }

    const userId = decodeToken(token);

    if (!userId) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Add userId to request object for use in controllers
    req.userId = userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
}

module.exports = {
  authenticate,
};
