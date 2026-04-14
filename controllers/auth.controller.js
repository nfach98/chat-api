require("dotenv").config();
const { decodeToken } = require("../utils/tokenizer");
const AuthService = require("../services/auth.service");

class AuthController {
  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({ token: result.token });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { phone, password } = req.body;
      const result = await AuthService.login(phone, password);
      res.status(200).json({ token: result.token });
    } catch (error) {
      const status = error.message === "User not found" ? 404 : 401;
      res.status(status).json({ message: error.message });
    }
  }

  static async profile(req, res) {
    try {
      const user = await AuthService.getUserProfile(req.userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async profileById(req, res) {
    try {
      const targetUserId = req.query.id;
      const user = await AuthService.getUserById(req.userId, targetUserId);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updatePicture(req, res) {
    try {
      const { upload } = require("../utils/filer");
      upload(req, res, async function (err) {
        if (err) {
          res.status(400).json({ message: err });
        } else {
          try {
            const result = await AuthService.updateUserPicture(req.userId, req.file.filename);
            res.status(200).json(result);
          } catch (serviceError) {
            res.status(400).json({ message: serviceError.message });
          }
        }
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = AuthController;
