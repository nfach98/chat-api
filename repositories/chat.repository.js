const Chat = require("../models/chat");

class ChatRepository {
    static async create(chatData) {
        const chat = new Chat(chatData);
        return await chat.save();
    }

    static async findByRoomId(roomId, options = {}) {
        let query = { room: roomId };

        if (options.cursor) {
            query.createdAt = { $lt: options.cursor };
        }

        return await Chat.find(query)
            .limit(options.limit || 20)
            .sort("-createdAt");
    }

    static async findUnreadByRoomAndUser(roomId, userId) {
        return await Chat.find({
            room: roomId,
            isRead: false,
            sentBy: { $ne: userId }
        });
    }

    static async markAsRead(roomId, userId) {
        return await Chat.updateMany(
            { room: roomId, sentBy: { $ne: userId } },
            { isRead: true }
        );
    }
}

module.exports = ChatRepository;