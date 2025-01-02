const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.get("/profile", authMiddleware.authenticate, AuthController.profile);
router.get(
  "/profile-id",
  authMiddleware.authenticate,
  AuthController.profileById
);
router.put(
  "/picture",
  authMiddleware.authenticate,
  AuthController.updatePicture
);

module.exports = router;
