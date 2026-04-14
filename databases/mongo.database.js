require("dotenv").config();
const mongoose = require("mongoose");

const mongoString = process.env.DATABASE_URL;

const options = {
  autoIndex: true,
};

if (process.env.MONGO_USER && process.env.MONGO_PASS) {
  options.user = process.env.MONGO_USER;
  options.pass = process.env.MONGO_PASS;
  options.authSource = process.env.MONGO_AUTH_SOURCE || "admin";
}

mongoose.connect(mongoString, options);
const database = mongoose.connection;

class MongoDatabase {
  static init() {
    database.on("error", (error) => {
      console.log(error);
    });

    database.once("connected", () => {
      console.log("Database Connected");
    });
  }

  static getStatus() {
    return mongoose.connection.readyState;
  }
}

module.exports = MongoDatabase;
