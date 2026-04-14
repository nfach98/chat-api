const RoomRepository = require("../repositories/room.repository");
const ChatRepository = require("../repositories/chat.repository");
const UserRepository = require("../repositories/user.repository");

class ChatService {
    static async createRoom(userId, users, roomName) {
        const addedUsers = [...users, userId];

        const roomData = { users: addedUsers };

        if (users.length === 1) {
            const user = await UserRepository.findById(users[0]);
            roomData.title = user.name;
        } else {
            roomData.title = roomName;
        }

        return await RoomRepository.create(roomData);
    }

    static async getUserRooms(userId) {
        const rooms = await RoomRepository.findByUserId(userId);
        const enrichedRooms = [];

        for (const room of rooms) {
            const otherUserIds = room.users.filter(u => u._id.toString() !== userId);
            const otherUser = await UserRepository.findById(otherUserIds[0]);
            const unreadChats = await ChatRepository.findUnreadByRoomAndUser(room._id, userId);

            // Set room display data
            if (!room.title) {
                room.title = otherUser.name;
            }
            if (!room.picture) {
                room.picture = otherUser.avatar;
            }
            room.countUnread = unreadChats.length;

            enrichedRooms.push(room);
        }

        return enrichedRooms;
    }

    static async getRoomById(roomId, userId) {
        const room = await RoomRepository.findById(roomId, { chats: 0 });
        const otherUserIds = room.users.filter(u => u._id.toString() !== userId);
        const otherUser = await UserRepository.findById(otherUserIds[0]);

        if (!room.title) {
            room.title = otherUser.name;
        }
        if (!room.picture) {
            room.picture = otherUser.avatar;
        }

        return room;
    }

    static async getChatsByRoomId(roomId, userId, cursor, limit = 20) {
        const chats = await ChatRepository.findByRoomId(roomId, { cursor, limit });

        // Mark messages as self or not
        chats.forEach(chat => {
            chat.isSelf = chat.sentBy._id.toString() === userId;
        });

        const nextCursor = chats.length > 0 ? chats[chats.length - 1].createdAt : null;
        const prevCursor = cursor && chats.length > 0 ? chats[0].createdAt : null;

        return {
            nextCursor,
            prevCursor,
            totalResults: chats.length,
            data: chats
        };
    }

    static async markRoomAsRead(roomId, userId) {
        const result = await ChatRepository.markAsRead(roomId, userId);

        if (result.modifiedCount === 0) {
            throw new Error("Read room operation failed");
        }

        return { message: "Read room is successful" };
    }

    static async saveMessage(messageData) {
        return await ChatRepository.create(messageData);
    }
}

module.exports = ChatService;