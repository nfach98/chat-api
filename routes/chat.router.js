const express = require("express");
const router = express.Router();

const ChatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/rooms", authMiddleware.authenticate, ChatController.getRooms);
router.get(
  "/room-detail",
  authMiddleware.authenticate,
  ChatController.getRoomDetail
);
router.post(
  "/create-room",
  authMiddleware.authenticate,
  ChatController.createRoom
);

module.exports = router;
