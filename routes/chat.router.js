const express = require("express");
const router = express.Router();

const ChatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/create-room",
  authMiddleware.authenticate,
  ChatController.createRoom
);
router.get("/rooms", authMiddleware.authenticate, ChatController.getRooms);
router.get("/room", authMiddleware.authenticate, ChatController.getRoomById);
router.get(
  "/chats",
  authMiddleware.authenticate,
  ChatController.getChatsByRoomId
);
router.put("/read-room", authMiddleware.authenticate, ChatController.readRoom);

module.exports = router;
