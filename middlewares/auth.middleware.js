const { decodeToken } = require("../utils/tokenizer");

function authenticate(req, res, next) {
  const token = req.header("authorization").split(" ")[1];
  const id_user = decodeToken(token);
  if (id_user == null) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

module.exports = {
  authenticate,
};
