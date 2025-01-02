function authenticate(req, res, next) {
  const token = req.header("authorization");
  if (token == null) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

module.exports = {
  authenticate,
};
