const Room = require("../models/room");

class RoomRepository {
    static async create(roomData) {
        const room = new Room(roomData);
        return await room.save();
    }

    static async findByUserId(userId) {
        return await Room.find({ users: { $in: [userId] } });
    }

    static async findById(id, projection = {}) {
        return await Room.findById(id, projection);
    }

    static async updateById(id, updateData) {
        return await Room.findOneAndUpdate({ _id: id }, updateData);
    }
}

module.exports = RoomRepository;