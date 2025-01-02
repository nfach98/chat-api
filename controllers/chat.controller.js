const { decodeToken } = require("../utils/tokenizer");

const url = require("url");

const User = require("../models/user");
const Room = require("../models/room");

class ChatController {
  static async getRooms(req, res) {
    try {
      const token = req.header("authorization").split(" ")[1];
      const id = decodeToken(token);
      const rooms = await Room.find({ users: { $in: [id] } });

      const updateRooms = [];
      for (let i = 0; i < rooms.length; i++) {
        const r = rooms[i];
        const ids = r.users.filter((u) => u !== id);
        const user = await User.findOne({ _id: { $in: ids } });
        r.set("name", user.name, { strict: false });
        if (r.picture == null) {
          r.picture = user.picture;
        }
        updateRooms.push(r);
      }

      res.status(200).json(rooms);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  static async getRoomDetail(req, res) {
    try {
      const token = req.header("authorization").split(" ")[1];
      const id_user = decodeToken(token);

      const parameters = url.parse(req.url, true);
      const id_param = parameters.query.id;

      const room = await Room.findById(id_param);
      const ids = room.users.filter((u) => u !== id_user);
      const user = await User.findOne({ _id: { $in: ids } });
      room.name = user.name;
      if (room.picture == null) {
        room.picture = user.picture;
      }
      res.status(200).json(room);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

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
        data.name = user.name;
      } else {
        data.name = req.body.name;
      }

      const savedRoom = await data.save();
      res.status(200).json(savedRoom);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = ChatController;
