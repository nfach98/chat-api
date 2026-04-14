const ChatService = require("../services/chat.service");

class ChatController {
  static async createRoom(req, res) {
    try {
      const { users, name } = req.body;
      const savedRoom = await ChatService.createRoom(req.userId, users, name);
      res.status(200).json(savedRoom);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getRooms(req, res) {
    try {
      const rooms = await ChatService.getUserRooms(req.userId);
      res.status(200).json(rooms);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getRoomById(req, res) {
    try {
      const roomId = req.query.id;
      const room = await ChatService.getRoomById(roomId, req.userId);
      res.status(200).json(room);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getChatsByRoomId(req, res) {
    try {
      const { id: roomId, cursor, limit = 20 } = req.query;
      const result = await ChatService.getChatsByRoomId(roomId, req.userId, cursor, parseInt(limit));
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async readRoom(req, res) {
    try {
      const roomId = req.query.id;
      const result = await ChatService.markRoomAsRead(roomId, req.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = ChatController;
