const bcrypt = require("bcryptjs");
const { createToken } = require("../utils/tokenizer");
const UserRepository = require("../repositories/user.repository");

class AuthService {
    static async register(userData) {
        const { name, phone, password } = userData;

        // Check if user already exists
        const existingUser = await UserRepository.findByPhone(phone);
        if (existingUser) {
            throw new Error("User already exists with this phone");
        }

        // Create user with hashed password
        const user = await UserRepository.create({
            name,
            phone,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(8))
        });

        if (!user) {
            throw new Error("User registration failed");
        }

        return {
            user,
            token: createToken(user._id)
        };
    }

    static async login(phone, password) {
        const user = await UserRepository.findByPhone(phone);

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        return {
            user,
            token: createToken(user._id)
        };
    }

    static async getUserProfile(userId) {
        const user = await UserRepository.findById(userId, {
            name: 1,
            phone: 1,
            avatar: 1,
            _id: 1
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    static async getUserById(currentUserId, targetUserId) {
        if (targetUserId === currentUserId) {
            throw new Error("Cannot get own profile using this method");
        }

        const user = await UserRepository.findById(targetUserId, {
            name: 1,
            phone: 1,
            avatar: 1,
            _id: 1
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    static async updateUserPicture(userId, filename) {
        const result = await UserRepository.updateById(userId, { picture: filename });

        if (!result.modifiedCount) {
            throw new Error("Update picture failed");
        }

        return { message: "Update picture is successful" };
    }
}

module.exports = AuthService;