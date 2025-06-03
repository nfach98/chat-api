const { decodeToken } = require("../utils/tokenizer");

const url = require("url");

const User = require("../models/user");
const Room = require("../models/room");
const Chat = require("../models/chat");

class ChatController {
  static async createRoom(req, res) {
    try {
      const token = req.header("authorization").split(" ")[1];
      const id = decodeToken(token);
      const users = req.body.users;
      const addedUsers = users;
      addedUsers.push(id);

      var data = new Room({ users: addedUsers });

      if (users.length == 1) {
        const user = await User.findOne({ _id: { $in: ids } });
        data.title = user.name;
      } else {
        data.title = req.body.name;
      }

      const savedRoom = await data.save();
      res.status(200).json(savedRoom);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getRooms(req, res) {
    try {
      const token = req.header("authorization").split(" ")[1];
      const idUser = decodeToken(token);
      const rooms = await Room.find({ users: { $in: [idUser] } });

      const newRooms = [];
      for (let i = 0; i < rooms.length; i++) {
        const r = rooms[i];
        const ids = r.users.filter((u) => u._id.toString() !== idUser);
        const user = await User.findOne({ _id: { $in: ids } });
        const chats = await Chat.find({
          room: r._id,
          isRead: false,
          sentBy: { $ne: idUser },
        });

        if (r.title == null) {
          r.title = user.name;
        }
        if (r.picture == null) {
          r.picture = user.avatar;
        }
        r.countUnread = chats.length;

        newRooms.push(r);
      }

      res.status(200).json(rooms);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  static async getRoomById(req, res) {
    try {
      const token = req.header("authorization").split(" ")[1];
      const idUser = decodeToken(token);

      const parameters = url.parse(req.url, true);
      const idParam = parameters.query.id;

      const room = await Room.findById(idParam).select("-chats");
      const ids = room.users.filter((u) => u._id.toString() !== idUser);
      const user = await User.findOne({ _id: { $in: ids } });

      if (room.title == null) {
        room.title = user.name;
      }
      if (room.picture == null) {
        room.picture = user.avatar;
      }

      res.status(200).json(room);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  static async getChatsByRoomId(req, res) {
    try {
      const token = req.header("authorization").split(" ")[1];
      const idUser = decodeToken(token);

      const parameters = url.parse(req.url, true);
      const { id, cursor, limit = 20 } = parameters.query;

      let query = { room: id };
      if (cursor) {
        query.createdAt = { $lt: cursor };
      }

      const chats = await Chat.find(query).limit(limit).sort("-createdAt");
      for (let i = 0; i < chats.length; i++) {
        const c = chats[i];
        c.isSelf = c.sentBy._id.toString() == idUser;
      }

      const prevCursor = cursor && chats.length > 0 ? chats[0].createdAt : null;
      const nextCursor =
        chats.length > 0 ? chats[chats.length - 1].createdAt : null;

      res.status(200).json({
        nextCursor,
        prevCursor,
        totalResults: chats.length,
        data: chats,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  static async readRoom(req, res) {
    try {
      const token = req.header("authorization").split(" ")[1];
      const idUser = decodeToken(token);

      const parameters = url.parse(req.url, true);
      const idRoom = parameters.query.id;

      const update = await Chat.updateMany(
        { room: idRoom, sentBy: { $ne: idUser } },
        { isRead: true }
      );
      if (update.modifiedCount > 0) {
        res.status(200).json({ message: "Read room is successful" });
      } else {
        res.status(400).json({ message: "Read room is failed" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = ChatController;
