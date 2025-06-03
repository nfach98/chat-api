require("dotenv").config();
const bcrypt = require("bcryptjs");
const url = require("url");

const { createToken, decodeToken } = require("../utils/tokenizer");
const { upload } = require("../utils/filer");

const User = require("../models/user");

class AuthController {
  static async register(req, res) {
    var data = new User({
      name: req.body.name,
      email: req.body.email,
    });
    data.password = data.generateHash(req.body.password);

    try {
      const user = await data.save();
      if (user != null) {
        const token = createToken(user._id);
        res.status(200).json({ token: token });
      } else {
        res.status(400).json({ message: "User registration failed" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });

      if (user == null) {
        res.status(400).json({ message: "User not found" });
      } else {
        let isPasswordValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (isPasswordValid) {
          const token = createToken(user._id);
          res.status(200).json({ token: token });
        } else {
          res.status(401).json({ message: "Validation failed" });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  static async profile(req, res) {
    try {
      const token = req.header("authorization").split(" ")[1];
      const id = decodeToken(token);
      const user = await User.findById(id, {
        name: 1,
        email: 1,
        avatar: 1,
        _id: 1,
      });

      if (user != null) {
        res.status(200).json(user);
      } else {
        res.status(400).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async profileById(req, res) {
    try {
      const token = req.header("authorization").split(" ")[1];
      const id = decodeToken(token);

      const parameters = url.parse(req.url, true);
      const id_param = parameters.query.id;

      if (id_param == id) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      const user = await User.findById(id_param, {
        name: 1,
        email: 1,
        avatar: 1,
        _id: 1,
      });

      if (user != null) {
        res.status(200).json(user);
      } else {
        res.status(400).json({ message: "User not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  static async updatePicture(req, res) {
    try {
      const token = req.header("authorization").split(" ")[1];
      const id = decodeToken(token);

      upload(req, res, async function (err) {
        if (err) {
          res.status(400).json({ message: err });
        } else {
          const filename = req.file.filename;
          const saved = await User.updateOne(
            { _id: id },
            { picture: filename }
          );
          if (saved) {
            res.status(200).json({ message: "Update picture is successful" });
          } else {
            res.status(400).json({ message: "Update picture is failed" });
          }
        }
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = AuthController;
