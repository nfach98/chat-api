const User = require("../models/user");

class UserRepository {
    static async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    static async findByPhone(phone) {
        return await User.findOne({ phone });
    }

    static async findById(id, projection = {}) {
        return await User.findById(id, projection);
    }

    static async updateById(id, updateData) {
        return await User.updateOne({ _id: id }, updateData);
    }

    static async findByIds(ids, projection = {}) {
        return await User.find({ _id: { $in: ids } }, projection);
    }
}

module.exports = UserRepository;