const Online = require("../models/online");

class OnlineRepository {
    static async upsertUserStatus(userId, isOnline) {
        return await Online.replaceOne(
            { user: userId },
            { isOnline, user: userId },
            { upsert: true }
        );
    }

    static async findByUserId(userId) {
        return await Online.findOne({ user: userId });
    }
}

module.exports = OnlineRepository;